import { AccountingTransaction } from "../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRule, DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../models/types/dispatch-rules/DispatchRuleTypes";
import { DispatchRuleRepository } from "../repositories/DispatchRuleRepository";
import { DispatchRuleHandler } from "./dispatch-rules/DispatchRuleHandler";
import { DispatchRuleServiceResolver } from "./dispatch-rules/DispatchRuleServiceResolver";
import { GroupDispatchRuleHandler } from "./dispatch-rules/GroupDispatchRuleHandler";
import { TypeDispatchRuleHandler } from "./dispatch-rules/TypeDispatchRuleHandler";
import { StatementItemService } from "./StatementItemService";

export class DispatchRuleService {
    private readonly dispatchRuleRepository: DispatchRuleRepository = DispatchRuleRepository.instance;

    constructor() {
    }

    dispatch(trx: AccountingTransaction): void {
        const statementItemService = new StatementItemService();
        const rules = this.getDispatchRules();
        // Search each rule and test if the transaction should be handled
        console.log(rules);
        for (const rule of rules) {
            console.log(`Checking rule ${rule.id} against transaction ${trx.Header.DLTERPId} of type ${trx.Header.TypeCode}`);
            const handler = this.getHandler(rule);
            if (handler.assert(rule, trx)) {
                console.log(`Rule ${rule.id} matches transaction ${trx.Header.DLTERPId}`);
                // rule matches transaction
                // need to get its total and add it to the contributing transaction of
                // the statement items linked to the rule
                const addedAmount = handler.getContributions(rule, trx);
                console.log(`Adding ${addedAmount} to statement items ${rule.statementItemIDs}`);
                for (const statementItemId of rule.statementItemIDs) {
                    if (!trx.Header.DLTERPId) {
                        throw new Error(`Transaction does not have an ID`);
                    }

                    if (!trx.Header.IssueDate) {
                        throw new Error(`Transaction ${trx.Header.DLTERPId} does not have an issue date`);
                    }

                    statementItemService.addTransactionContributions(statementItemId, trx.Header.IssueDate, {
                        amount: addedAmount,
                        transactionId: trx.Header.DLTERPId
                    });
                }
            }
        }
    }

    getDispatchRules(): DispatchRule[] {
        const rules: DispatchRule[] = [];
        for (const ruleType in DispatchRuleType) {
            const svc = DispatchRuleServiceResolver.instance.resolve({ ruleType });
            rules.push(...svc.list())
        }

        return rules;
    }

    getDispatchRule(id: number): DispatchRule | null {
        const rule = this.dispatchRuleRepository.getDispatchRule(id);
        if (!rule) {
            return null;
        }

        const svc = DispatchRuleServiceResolver.instance.resolve(rule);
        return svc.get(id);
    }

    deleteDispatchRule(id: number): void {
        this.dispatchRuleRepository.deleteDispatchRule(id);
    }

    createDispatchRule(ruleRequest: DispatchRuleDto): DispatchRule {
        const svc = DispatchRuleServiceResolver.instance.resolve(ruleRequest);
        const rule = svc.create(ruleRequest);
        return rule;
    }

    updateDispatchRule(ruleRequest: DispatchRuleDto): DispatchRule {
        const svc = DispatchRuleServiceResolver.instance.resolve(ruleRequest);
        return svc.update(ruleRequest);
    }

    private getHandler(rule: DispatchRule): DispatchRuleHandler<DispatchRule, AccountingTransaction> {
        switch (rule.ruleType) {
            case DispatchRuleType.TYPE:
                return new TypeDispatchRuleHandler();
            case DispatchRuleType.GROUP:
                return new GroupDispatchRuleHandler();
            default:
                throw new Error(`Unknown rule type: ${rule.ruleType}`);
        }
    }
}
