import { DispatchRule, DispatchRuleDto } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { GroupDispatchRuleService } from "./group/GroupDispatchRuleService";
import { IDispatchRuleService } from "./IDispatchRuleService";
import { TypeDispatchRuleService } from "./type/TypeDistpatchRuleService";
import { VatGroupDispatchRuleService } from "./vat-group/VatGroupDispatchRuleService";

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
            case DispatchRuleType.VAT_GROUP:
                return new VatGroupDispatchRuleService();
            default:
                throw new Error("No service configured for rule type " + rule.ruleType);
        }
    }
}
