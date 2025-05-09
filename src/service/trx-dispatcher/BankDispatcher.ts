import { DispatchRuleServiceResolver } from "../dispatch-rules/DispatchRuleServiceResolver";
import { StatementItemService } from "../StatementItemService";
import { ITrxDispatcher } from "./ITrxDispatcher";
import { BankAccountingTransaction } from "../../models/types/accounting-transaction/BankAccountingTransaction";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { AccountingOperation } from "../../models/types/dispatch-rules/AccountingOperation";
import { isDefined } from "../../models/types/common";
import { StatementItem } from "../../models/types/statement-items/StatementItem";
import { AccountDispatchRule } from "../../models/types/dispatch-rules/bank/AccountDispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { CausalDispatchRule } from "../../models/types/dispatch-rules/bank/CausalDispatchRule";
import { BankAccountDispatchRuleService } from "../dispatch-rules/bank-account/BankAccountDispatchRuleService";
import { DispatchRuleService } from "../DispatchRulesService";
import { BankCausalDispatchRuleService } from "../dispatch-rules/bank-causal/BankCausalDispatchRuleService";
import { BankCounterpartDispatchRuleService } from "../dispatch-rules/bank-counterpart/BankCounterpartDispatchRuleService";

export class BankDispatcher implements ITrxDispatcher<BankAccountingTransaction> {
    dispatch(trx: BankAccountingTransaction): void {
        const statementItemService = new StatementItemService();

        // Check account rules first
        let accountRules = this.getAccountRules(trx);
        if (accountRules.length === 0) {
            // Create new statement item and rule for account
            const hash = this.integerHash(trx.Account.IBAN);
            const statementItem = new StatementItem(hash, trx.Account.IBAN, 'CHF');
            statementItemService.storeStatementItem(statementItem);

            const ruleToCreate = new AccountDispatchRule(undefined, [hash], trx.Account.IBAN, AccountingOperation.DEBIT);
            const newRule = DispatchRuleServiceResolver.service({ ruleType: DispatchRuleType.BANK_ACCOUNT })
                .create(ruleToCreate.toDto());

            accountRules = [newRule];
        }

        // Check counterpart rules
        let matchingRules = this.getCounterpartRules(trx);

        // If no counterpart rules, check causal rules
        if (matchingRules.length === 0) {
            matchingRules = this.getCausalRules(trx);

            // If no causal rules, create new statement item and rule
            if (matchingRules.length === 0 && trx.DomainCode && trx.FamilyCode && trx.SubFamilyCode) {
                const causalName = `${trx.DomainCode}-${trx.FamilyCode}-${trx.SubFamilyCode}`;
                const hash = this.integerHash(causalName);
                statementItemService.storeStatementItem(new StatementItem(hash, causalName, 'CHF'));

                const ruleToCreate = new CausalDispatchRule(undefined, [hash], AccountingOperation.CREDIT, trx.DomainCode, trx.FamilyCode, trx.SubFamilyCode);
                const newRule = new DispatchRuleService().createDispatchRule(ruleToCreate.toDto());
                matchingRules = [newRule];
            }
        }

        // Process all rules and compute the total amount
        const rules = [...accountRules, ...matchingRules];
        let totalAmount = 0;

        console.log(`Rules: ${JSON.stringify(rules)}`);
        for (const rule of rules) {
            console.log(`Checking rule ${rule.id} against transaction ${trx.Header.DLTERPId} of type ${trx.Header.TypeCode}`);
            const handler = DispatchRuleServiceResolver.handler(rule);
            if (handler.assertTrxActivation(rule, trx)) {
                console.log(`Rule ${rule.id} matches transaction ${trx.Header.DLTERPId}`);

                const contribution = handler.getComputedContributions(rule, trx);
                for (const statementItemId of rule.statementItemIDs) {
                    if (!trx.Header.DLTERPId) {
                        throw new Error(`Transaction does not have an ID`);
                    }

                    if (!trx.Header.IssueDate) {
                        throw new Error(`Transaction ${trx.Header.DLTERPId} does not have an issue date`);
                    }

                    totalAmount += contribution;

                    statementItemService.addStatementItemTransaction(statementItemId, trx.Header.IssueDate, {
                        amount: contribution,
                        transactionId: trx.Header.DLTERPId
                    });

                    console.log(`Added transaction of ${JSON.stringify(trx.Header.IssueDate)} to statement`, statementItemId)
                }
            } else {
                console.log(`Rule ${rule.id} does not match transaction ${trx.Header.DLTERPId}`);
            }
        }
        
        if(totalAmount !== 0) {
            throw new Error(`The transaction ${trx.Header.DLTERPId} does not balance itself! Remaining unbalanced amount: ${totalAmount}`);
        }
    }

    private getAccountRules(trx: BankAccountingTransaction): DispatchRule[] {
        const dispatchRuleService = new BankAccountDispatchRuleService();
        const accountRules = dispatchRuleService.listByIBAN(trx.Account.IBAN);
        console.log(`Account rules: ${JSON.stringify(accountRules)}`);
        return accountRules.filter(isDefined);
    }

    private getCounterpartRules(trx: BankAccountingTransaction): DispatchRule[] {
        if (!trx.Counterpart) {
            return [];
        }

        const counterpartRules = new BankCounterpartDispatchRuleService().listByCounterpartName(trx.Counterpart.Name);
        return counterpartRules.filter(isDefined);
    }

    private getCausalRules(trx: BankAccountingTransaction): DispatchRule[] {
        if (!trx.DomainCode || !trx.FamilyCode || !trx.SubFamilyCode) {
            return [];
        }

        const causalRules = new BankCausalDispatchRuleService().listByFullCausal(trx.DomainCode, trx.FamilyCode, trx.SubFamilyCode);
        return causalRules.filter(isDefined);
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
