import { AccountingTransaction } from "../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRule, DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../models/types/dispatch-rules/DispatchRuleTypes";
import { DispatchRuleRepository } from "../repositories/dispatch-rules/DispatchRuleRepository";
import { DispatchRuleServiceResolver } from "./dispatch-rules/DispatchRuleServiceResolver";
import { TrxDispatcher } from "./trx-dispatcher/TrxDispatcher";
import { AccountingOperationDispatchRuleIndexRepository } from "../repositories/dispatch-rules/AccountingOperationDispatchRuleIndexRepository";

export class DispatchRuleService {
    private readonly dispatchRuleRepository: DispatchRuleRepository = DispatchRuleRepository.instance;
    private readonly accountingOperationIndexRepository: AccountingOperationDispatchRuleIndexRepository = AccountingOperationDispatchRuleIndexRepository.instance;

    constructor() {
    }

    dispatch(trx: AccountingTransaction): void {
        TrxDispatcher.instance.dispatch(trx);
    }

    getDispatchRules(): DispatchRule[] {
        const rules: DispatchRule[] = [];
        for (const ruleType in DispatchRuleType) {
            const svc = DispatchRuleServiceResolver.service({ ruleType: ruleType as DispatchRuleType });
            console.log(`Fetching rules of type ${ruleType}`);
            console.log(`Service: ${svc.constructor.name}`);
            rules.push(...svc.list())
        }

        return rules;
    }

    getDispatchRule(id: number): DispatchRule | null {
        const rule = this.dispatchRuleRepository.getDispatchRule(id);
        if (!rule) {
            return null;
        }

        const svc = DispatchRuleServiceResolver.service(rule);
        return svc.get(id);
    }

    deleteDispatchRule(id: number): void {
        const rule = this.dispatchRuleRepository.getDispatchRule(id);
        if (rule && rule.accountingOperation) {
            this.accountingOperationIndexRepository.removeRuleIdFromOperation(rule.accountingOperation, id);
        }
        this.dispatchRuleRepository.deleteDispatchRule(id);
    }


    //TODO rimuovere possibilità di settare Debit o credit nell'operation
    createDispatchRule(ruleRequest: DispatchRuleDto): DispatchRule {
        const svc = DispatchRuleServiceResolver.service({ ruleType: ruleRequest.ruleType as DispatchRuleType });
        const rule = svc.create(ruleRequest);
        if(!rule.accountingOperation)
            throw new Error("Accounting operation must be set on the rule stored");
        this.accountingOperationIndexRepository.addRuleIdToOperation(rule.accountingOperation, rule.id!);
        return rule;
    }

    updateDispatchRule(ruleRequest: DispatchRuleDto): DispatchRule {
        const svc = DispatchRuleServiceResolver.service({ ruleType: ruleRequest.ruleType as DispatchRuleType });
        const currentRule = this.dispatchRuleRepository.getDispatchRule(ruleRequest.id!);
        const updatedRule = svc.update(ruleRequest);

        if(!currentRule?.accountingOperation || !updatedRule.accountingOperation)
            throw new Error("Accounting operation must be set on the rule stored");

        if (currentRule && currentRule.accountingOperation !== updatedRule.accountingOperation) {
            this.accountingOperationIndexRepository.removeRuleIdFromOperation(currentRule.accountingOperation, currentRule.id!);
            this.accountingOperationIndexRepository.addRuleIdToOperation(updatedRule.accountingOperation, updatedRule.id!);
        }
        
        return updatedRule;
    }
}
