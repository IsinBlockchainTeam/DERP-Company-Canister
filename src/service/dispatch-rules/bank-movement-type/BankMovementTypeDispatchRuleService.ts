import { DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { MovementTypeDispatchRule } from "../../../models/types/dispatch-rules/bank/MovementTypeDispatchRule";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class BankMovementTypeDispatchRuleService extends BaseDispatchRuleService<MovementTypeDispatchRule> {
    public readonly ruleType = DispatchRuleType.TYPE;
    
    public override onCreate(rule: MovementTypeDispatchRule): void {
    }

    public override onUpdate(currentRule: MovementTypeDispatchRule, newRule: MovementTypeDispatchRule): void {
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (!(ruleDto as any).movementType || (ruleDto as any).movementType.length < 1) {
            throw new Error("Bank movement type dispatch rule must have exactly one movement type");
        }
    }
} 