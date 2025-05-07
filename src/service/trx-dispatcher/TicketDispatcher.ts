import { TicketAccountingTransaction } from "../../models/types/accounting-transaction/TicketAccountingTransaction";
import { DispatchRuleServiceResolver } from "../dispatch-rules/DispatchRuleServiceResolver";
import { StatementItemService } from "../StatementItemService";
import { ITrxDispatcher } from "./ITrxDispatcher";
import { VatGroupDispatchRuleService } from "../dispatch-rules/vat-group/VatGroupDispatchRuleService";
import { StoreDispatchRuleService } from "../dispatch-rules/store/StoreDispatchRuleService";
import { AccountingOperation } from "../../models/types/dispatch-rules/AccountingOperation";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { AccountingOperationDispatchRuleIndexRepository } from "../../repositories/dispatch-rules/AccountingOperationDispatchRuleIndexRepository";
import { DispatchRuleRepository } from "../../repositories/dispatch-rules/DispatchRuleRepository";
import { GroupDispatchRuleIndexRepository } from "../../repositories/dispatch-rules/GroupDispatchRuleIndexRepository";

export class TicketDispatcher implements ITrxDispatcher<TicketAccountingTransaction> {
    dispatch(trx: TicketAccountingTransaction): void {
        const statementItemService = new StatementItemService();

        const debitRules = this.getDebitRules(trx);
        const creditRules = this.getCreditRules(trx);
        
        const rules = [
            ...debitRules,
            ...creditRules,
        ];

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
            const lastRule = rules[rules.length - 1];
            if (lastRule.id !== undefined) {
                const lastRuleIdStr = String(lastRule.id);
                if (contributionsByRule.has(lastRuleIdStr)) {
                    // Adjust the contribution of the last rule
                    const data = contributionsByRule.get(lastRuleIdStr)!;
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
    
    private getDebitRules(trx: TicketAccountingTransaction): DispatchRule[] {
        const operationIndexRepository = AccountingOperationDispatchRuleIndexRepository.instance;
        const operationRuleIds = operationIndexRepository.getDispatchRuleIdsForOperation(AccountingOperation.DEBIT);
        
        // Get all unique rule IDs from different sources
        const uniqueRuleIds = new Set<number>();
        
        // Add operation-based rule IDs
        operationRuleIds.forEach(id => uniqueRuleIds.add(id));
        
        // Add group-based rule IDs
        // But only add rules that are configured with "DEBIT" operation
        if (trx.LineItemGroups) {
            const groupIndexRepository = GroupDispatchRuleIndexRepository.instance;
            trx.LineItemGroups.forEach(group => {
                const groupRuleIds = groupIndexRepository.getDispatchRuleIdsForGroup(group.Id);
                // Only add IDs that are also in operationRuleIds
                groupRuleIds.forEach(id => {
                    if (operationRuleIds.includes(id)) {
                        uniqueRuleIds.add(id);
                    }
                });
            });
        }
        
        // Add VAT group-based rule IDs
        // But only add rules that are configured with "DEBIT" operation
        if (trx.Tax) {
            const vatGroupService = new VatGroupDispatchRuleService();
            trx.Tax.forEach(vatGroup => {
                const vatGroupRules = vatGroupService.listByGroup(vatGroup.Id);
                vatGroupRules.forEach(rule => {
                    if (rule.id !== undefined && operationRuleIds.includes(rule.id)) {
                        uniqueRuleIds.add(rule.id);
                    }
                });
            });
        }
        
        // Retrieve all rules and filter out null values
        const rules: DispatchRule[] = [];
        for (const ruleId of uniqueRuleIds) {
            const rule = DispatchRuleRepository.instance.getDispatchRule(ruleId);
            if (rule !== null) {
                rules.push(rule);
            }
        }
        
        return rules;
    }

    private getCreditRules(trx: TicketAccountingTransaction): DispatchRule[] {
        const operationIndexRepository = AccountingOperationDispatchRuleIndexRepository.instance;
        const operationRuleIds = operationIndexRepository.getDispatchRuleIdsForOperation(AccountingOperation.CREDIT);
        
        // Get all unique rule IDs from different sources
        const uniqueRuleIds = new Set<number>();
        
        // Add operation-based rule IDs
        operationRuleIds.forEach(id => uniqueRuleIds.add(id));
        
        // Add store-based rule IDs
        // But only add rules that are configured with "CREDIT" operation
        const storeRuleService = new StoreDispatchRuleService();
        const storeRules = storeRuleService.listByStore(trx.Header.StoreId);
        storeRules.forEach(rule => {
            if (rule.id !== undefined && operationRuleIds.includes(rule.id)) {
                uniqueRuleIds.add(rule.id);
            }
        });
        
        // Retrieve all rules and filter out null values
        const rules: DispatchRule[] = [];
        for (const ruleId of uniqueRuleIds) {
            const rule = DispatchRuleRepository.instance.getDispatchRule(ruleId);
            if (rule !== null) {
                rules.push(rule);
            }
        }
        
        return rules;
    }

    private hashStringToInt32(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0; // Ensure int32 range
        }

        return hash;
    }
}
