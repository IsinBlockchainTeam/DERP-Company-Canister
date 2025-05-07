import { DispatchRule, DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../models/types/dispatch-rules/DispatchRuleTypes";
import { TypeDispatchRule } from "../models/types/dispatch-rules/TypeDispatchRule";
import { GroupDispatchRule } from "../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { StoreDispatchRule } from "../models/types/dispatch-rules/ticket/StoreDispatchRule";
import { VatGroupDispatchRule } from "../models/types/dispatch-rules/ticket/VatGroupDispatchRule";

export class DispatchRuleEntityMapper {
    public static fromDto(dto: DispatchRuleDto): DispatchRule {
        switch (dto.ruleType) {
            case DispatchRuleType.TYPE:
                return TypeDispatchRule.fromDto(dto);
            case DispatchRuleType.GROUP:
                return GroupDispatchRule.fromDto(dto);
            case DispatchRuleType.STORE:
                return StoreDispatchRule.fromDto(dto);
            case DispatchRuleType.VAT_GROUP:
                return VatGroupDispatchRule.fromDto(dto);
            default:
                throw new Error(`Invalid dispatch rule type: ${dto.ruleType}`);
        }
    }
}