import { TicketAccountingTransaction } from "../../models/types/accounting-transaction/TicketAccountingTransaction";
import { DispatchRuleServiceResolver } from "../dispatch-rules/DispatchRuleServiceResolver";
import { StatementItemService } from "../StatementItemService";
import { ITrxDispatcher } from "./ITrxDispatcher";
import { VatGroupDispatchRuleService } from "../dispatch-rules/vat-group/VatGroupDispatchRuleService";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { GroupDispatchRuleService } from "../dispatch-rules/group/GroupDispatchRuleService";
import { AccountingTransactionType } from "../../models/types/accounting-transaction/AccountingTransaction";
import { PaymentMethodDispatchRuleService } from "../dispatch-rules/payment-method/PaymentMethodDispatchRuleService";
import { StatementItem } from '../../models/types/statement-items/StatementItem';
import { PaymentMethodDispatchRule } from '../../models/types/dispatch-rules/ticket/PaymentMethodDispatchRule';
import { GroupDispatchRule } from '../../models/types/dispatch-rules/ticket/GroupDispatchRule';
import { VatGroupDispatchRule } from '../../models/types/dispatch-rules/ticket/VatGroupDispatchRule';
export class TicketDispatcher implements ITrxDispatcher<TicketAccountingTransaction> {
    dispatch(trx: TicketAccountingTransaction): void {
        const statementItemService = new StatementItemService();

        const debitRules = this.getOrCreateDebitRules(trx,statementItemService);

        const creditRules = this.getOrCreateCreditRules(trx,statementItemService);

        // make rules array unique
        const rules = [
            ...debitRules,
            ...creditRules,
        ].filter((rule, index, self) =>
            index === self.findIndex((t) => t.id === rule.id)
        );

        let total = 0;

        // Store all contributions before applying them
        const contributionsByRule: Map<string, {
            rule: any,
            contribution: number,
            statementItems: number[]
        }> = new Map();

        for (const rule of rules) {
            console.log(`Checking rule ${rule.id} against transaction ${trx.Header.DLTERPId} of type ${trx.Header.TypeCode}`);
            const handler = DispatchRuleServiceResolver.handler(rule);
            if (handler.assertTrxActivation(rule, trx)) {
                console.log(`Rule ${rule.id} matches transaction ${trx.Header.DLTERPId}`);

                const contribution = handler.getComputedContributions(rule, trx);

                // Store the contribution for later use
                if (rule.id !== undefined) {
                    contributionsByRule.set(String(rule.id), {
                        rule,
                        contribution,
                        statementItems: rule.statementItemIDs
                    });
                }

                total += contribution;
            }

            console.log(`Rule ${rule.id} does not match transaction ${trx.Header.DLTERPId}`);
        }

        // If there's a non-zero total, adjust the last rule's contribution
        if (total !== 0) {
            const firstGroupRule = rules.find(rule => rule.ruleType === DispatchRuleType.GROUP);
            if (!firstGroupRule) {
                throw new Error(`No group rule found for transaction ${trx.Header.DLTERPId}`);
            }

            if (firstGroupRule.id !== undefined) {
                const firstGroupRuleIdStr = String(firstGroupRule.id);
                if (contributionsByRule.has(firstGroupRuleIdStr)) {
                    // Adjust the contribution of the last rule
                    const data = contributionsByRule.get(firstGroupRuleIdStr)!;
                    data.contribution -= total;
                }
            }
        }

        // Now apply all contributions
        for (const { rule, contribution, statementItems } of contributionsByRule.values()) {
            if (!trx.Header.DLTERPId) {
                throw new Error(`Transaction does not have an ID`);
            }

            if (!trx.Header.IssueDate) {
                throw new Error(`Transaction ${trx.Header.DLTERPId} does not have an issue date`);
            }

            for (const statementItemId of statementItems) {
                statementItemService.addStatementItemTransaction(statementItemId, trx.Header.IssueDate, {
                    amount: contribution,
                    transactionId: trx.Header.DLTERPId,
                    txType: AccountingTransactionType.TICKET,
                    originalRuleId: rule.id,
                });
                console.log(`Added transaction of ${JSON.stringify(trx.Header.IssueDate)} to statement`, statementItemId);
            }
        }
    }

    private getOrCreateCreditRules(trx: TicketAccountingTransaction,statementItemService:StatementItemService): DispatchRule[] {
        const vatGroupRulesService = new VatGroupDispatchRuleService();
        const groupsRulesService = new GroupDispatchRuleService();
        const rules: DispatchRule[] = [];

        if (trx.LineItemGroups) {
            trx.LineItemGroups.forEach(group => {
                const groupRules = groupsRulesService.listByGroup(group.Id);
                if(groupRules.length === 0) {
                    const hash = this.integerHash(group.Id);
                    const statementItem = new StatementItem(hash,group.Description,'CHF');
                    statementItemService.storeStatementItem(statementItem);
                    const ruleToCreate = new GroupDispatchRule(
                        undefined,
                        [hash],
                        group.Id,
                        trx.Header.StoreId
                    )
                    const newRule = DispatchRuleServiceResolver.service({ruleType:DispatchRuleType.GROUP})
                        .create(ruleToCreate.toDto());
                    groupRules.push(newRule as GroupDispatchRule);
                }
                groupRules.forEach(rule => {
                    rules.push(rule);
                });
            });
        }

        if (trx.Tax) {
            trx.Tax.forEach(vatGroup => {
                const vatGroupRules = vatGroupRulesService.listByGroup(vatGroup.Id);
                if(vatGroupRules.length === 0) {
                    const hash = this.integerHash(vatGroup.Id);
                    const statementItem = new StatementItem(hash,vatGroup.TypeCode + ' - '+ vatGroup.RateApplicablePercent,'CHF');
                    statementItemService.storeStatementItem(statementItem);
                    const ruleToCreate = new VatGroupDispatchRule(
                        undefined,
                        [hash],
                        vatGroup.Id,
                        trx.Header.StoreId
                    )
                    const newRule = DispatchRuleServiceResolver.service({ruleType:DispatchRuleType.VAT_GROUP})
                        .create(ruleToCreate.toDto());
                    vatGroupRules.push(newRule as VatGroupDispatchRule);
                }
                vatGroupRules.forEach(rule => {
                    rules.push(rule);
                });
            });
        }

        return rules
    }

    /**
     * Get or create (each payment method must have a rule and a statement item associated)
     * debit rules based on payment methods used in the transaction.
     * @param trx
     * @param statementItemService
     * @private
     */
    private getOrCreateDebitRules(trx: TicketAccountingTransaction,statementItemService:StatementItemService): DispatchRule[] {
        // Get all unique rule IDs from different sources
        const rules: DispatchRule[] = [];

        // Add store-based rule IDs
        // But only add rules that are configured with "CREDIT" operation
        const ruleService = new PaymentMethodDispatchRuleService();
        
        if (trx.PaymentDetails) {
            for (const payment of trx.PaymentDetails) {
                let paymentMethodRules = ruleService.listByPaymentMethod(payment.paymentTypeId);
                if(paymentMethodRules.length === 0) {
                    const hash = this.integerHash(payment.paymentType);
                    const statementItem = new StatementItem(hash,payment.paymentType,'CHF');
                    statementItemService.storeStatementItem(statementItem);
                    const ruleToCreate = new PaymentMethodDispatchRule(
                        undefined,
                        [hash],
                        payment.paymentTypeId,
                        trx.Header.StoreId
                    )
                    const newRule = DispatchRuleServiceResolver.service({ruleType:DispatchRuleType.PAYMENT_METHOD})
                        .create(ruleToCreate.toDto());
                    paymentMethodRules.push(newRule as PaymentMethodDispatchRule);
                }
                paymentMethodRules.forEach(rule => {
                    rules.push(rule);
                });
            }
        }
        
        return rules;
    }

    private integerHash(body: string): number {
        let hash = 0;
        for (let i = 0; i < body.length; i++) {
            const char = body.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
        }

        // Assicurarsi che il risultato sia sempre positivo e all'interno di un intero a 32 bit
        return hash & 0x7FFFFFFF;
    }

}
