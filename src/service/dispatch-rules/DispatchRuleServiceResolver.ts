import { DispatchRule, DispatchRuleDto } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { GroupDispatchRuleService } from "./GroupDispatchRuleService";
import { IDispatchRuleService } from "./IDispatchRuleService";
import { TypeDispatchRuleService } from "./TypeDistpatchRuleService";

export class DispatchRuleServiceResolver {
    private static _instance: DispatchRuleServiceResolver;

    static get instance(): DispatchRuleServiceResolver {
        if (!DispatchRuleServiceResolver._instance) {
            DispatchRuleServiceResolver._instance = new DispatchRuleServiceResolver();
        }

        return DispatchRuleServiceResolver._instance;
    }

    private constructor() { }

    resolve(rule: Pick<DispatchRuleDto, 'ruleType'>): IDispatchRuleService<DispatchRule> {
        switch (rule.ruleType) {
            case DispatchRuleType.TYPE:
                return new TypeDispatchRuleService();
            case DispatchRuleType.GROUP:
                return new GroupDispatchRuleService();
            default:
                throw new Error("Invalid rule type: " + rule.ruleType);
        }
    }
}
