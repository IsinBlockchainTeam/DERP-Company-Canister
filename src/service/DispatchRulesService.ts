import { AccountingTransaction } from "../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRule, DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../models/types/dispatch-rules/DispatchRuleTypes";
import { DispatchRuleRepository } from "../repositories/dispatch-rules/DispatchRuleRepository";
import { DispatchRuleServiceResolver } from "./dispatch-rules/DispatchRuleServiceResolver";
import { TrxDispatcher } from "./trx-dispatcher/TrxDispatcher";

export class DispatchRuleService {
    private readonly dispatchRuleRepository: DispatchRuleRepository = DispatchRuleRepository.instance;

    constructor() {
    }

    dispatch(trx: AccountingTransaction): void {
        TrxDispatcher.instance.dispatch(trx);
    }

    getDispatchRules(): DispatchRule[] {
        const rules: DispatchRule[] = [];
        for (const ruleType in DispatchRuleType) {
            const svc = DispatchRuleServiceResolver.service({ ruleType: ruleType as DispatchRuleType });
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
        this.dispatchRuleRepository.deleteDispatchRule(id);
    }

    createDispatchRule(ruleRequest: DispatchRuleDto): DispatchRule {
        const svc = DispatchRuleServiceResolver.service({ ruleType: ruleRequest.ruleType as DispatchRuleType });
        const rule = svc.create(ruleRequest);
        return rule;
    }

    updateDispatchRule(ruleRequest: DispatchRuleDto): DispatchRule {
        const svc = DispatchRuleServiceResolver.service({ ruleType: ruleRequest.ruleType as DispatchRuleType });
        return svc.update(ruleRequest);
    }
}
