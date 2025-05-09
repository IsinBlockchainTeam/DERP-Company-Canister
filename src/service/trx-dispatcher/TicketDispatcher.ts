import { TicketAccountingTransaction } from "../../models/types/accounting-transaction/TicketAccountingTransaction";
import { DispatchRuleServiceResolver } from "../dispatch-rules/DispatchRuleServiceResolver";
import { StatementItemService } from "../StatementItemService";
import { ITrxDispatcher } from "./ITrxDispatcher";
import { VatGroupDispatchRuleService } from "../dispatch-rules/vat-group/VatGroupDispatchRuleService";
import { StoreDispatchRuleService } from "../dispatch-rules/store/StoreDispatchRuleService";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { StoreDispatchRule } from "../../models/types/dispatch-rules/ticket/StoreDispatchRule";
import { GroupDispatchRuleService } from "../dispatch-rules/group/GroupDispatchRuleService";

export class TicketDispatcher implements ITrxDispatcher<TicketAccountingTransaction> {
    dispatch(trx: TicketAccountingTransaction): void {
        const statementItemService = new StatementItemService();

        const debitRules = this.getDebitRules(trx);
        const creditRules = this.getCreditRules(trx);

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
                    transactionId: trx.Header.DLTERPId
                });
                console.log(`Added transaction of ${JSON.stringify(trx.Header.IssueDate)} to statement`, statementItemId);
            }
        }
    }

    private getCreditRules(trx: TicketAccountingTransaction): DispatchRule[] {
        const vatGroupRulesService = new VatGroupDispatchRuleService();
        const groupsRulesService = new GroupDispatchRuleService();
        const rules: DispatchRule[] = [];

        if (trx.LineItemGroups) {
            trx.LineItemGroups.forEach(group => {
                const groupRules = groupsRulesService.listByGroup(group.Id);
                groupRules.forEach(rule => {
                    rules.push(rule);
                });
            });
        }

        if (trx.Tax) {
            trx.Tax.forEach(vatGroup => {
                const vatGroupRules = vatGroupRulesService.listByGroup(vatGroup.Id);
                vatGroupRules.forEach(rule => {
                    rules.push(rule);
                });
            });
        }

        return rules
    }

    private getDebitRules(trx: TicketAccountingTransaction): DispatchRule[] {
        // Get all unique rule IDs from different sources
        const rules: StoreDispatchRule[] = [];

        // Add store-based rule IDs
        // But only add rules that are configured with "CREDIT" operation
        const storeRuleService = new StoreDispatchRuleService();
        const storeRules = storeRuleService.listByStore(trx.Header.StoreId);
        storeRules.forEach(rule => {
            rules.push(rule);
        });
        
        return rules;
    }
}
