import { CombinedDispatchRule } from "../../../models/types/dispatch-rules/CombinedDispatchRule";
import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";
import { DispatchRuleServiceResolver } from "../DispatchRuleServiceResolver";

export class CombinedDispatchRuleService extends BaseDispatchRuleService<CombinedDispatchRule> {
    public readonly ruleType = DispatchRuleType.COMBINED;

    public override validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, "id">): void {
        if (!ruleDto.rules || ruleDto.rules.length === 0 || ruleDto.rules[0]!.length === 0) {
            throw new Error("Combined dispatch rule must have at least one rule");
        }

        for (const r of ruleDto.rules[0]!) {
            if (!r.ruleType) {
                throw new Error("Combined dispatch rule must have a rule type");
            }

            // Remove null properties from r before spreading
            const cleanedRule = Object.fromEntries(
                Object.entries(r).filter(([_, value]) => value !== null && value !== undefined)
            );

            DispatchRuleServiceResolver.service({ ruleType: r.ruleType }).validateRuleDto({
                ...ruleDto,
                ...cleanedRule,
            });
        }
    }


    public override onCreate(rule: CombinedDispatchRule): void {
        for (const r of rule.rules) {
            const svc = DispatchRuleServiceResolver.service(r);
            svc.onCreate(r);
        }
    }

    public override onUpdate(currentRule: CombinedDispatchRule, newRule: CombinedDispatchRule): void {
        currentRule.rules.forEach((r, index) => {
            const svc = DispatchRuleServiceResolver.service(r);
            const otherRule = newRule.rules.find(r2 => r2.ruleType === r.ruleType);
            if (otherRule) {
                svc.onUpdate(r, otherRule);
            } else {
                svc.onCreate(r);
            }
        });
    }
}