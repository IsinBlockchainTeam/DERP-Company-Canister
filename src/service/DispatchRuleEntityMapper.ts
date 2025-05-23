import { DispatchRule, DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../models/types/dispatch-rules/DispatchRuleTypes";
import { TypeDispatchRule } from "../models/types/dispatch-rules/TypeDispatchRule";
import { AccountDispatchRule } from "../models/types/dispatch-rules/bank/AccountDispatchRule";
import { CounterpartDispatchRule } from "../models/types/dispatch-rules/bank/CounterpartDispatchRule";
import { MovementTypeDispatchRule } from "../models/types/dispatch-rules/bank/MovementTypeDispatchRule";
import { GroupDispatchRule } from "../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { StoreDispatchRule } from "../models/types/dispatch-rules/ticket/StoreDispatchRule";
import { VatGroupDispatchRule } from "../models/types/dispatch-rules/ticket/VatGroupDispatchRule";
import { CausalDispatchRule } from "../models/types/dispatch-rules/bank/CausalDispatchRule";
import { CombinedDispatchRule } from "../models/types/dispatch-rules/CombinedDispatchRule";
import { PaymentMethodDispatchRule } from "../models/types/dispatch-rules/ticket/PaymentMethodDispatchRule";
import { IssuerDispatchRule } from "../models/types/dispatch-rules/invoice/IssuerDispatchRule";
import { RecipientDispatchRule } from "../models/types/dispatch-rules/invoice/RecipientDispatchRule";

/**
 * Mapper class for converting DispatchRuleDto objects to their corresponding DispatchRule domain entities.
 * Implements a factory pattern that creates the appropriate DispatchRule subclass instance based on the ruleType.
 * The absence of a default case in the switch statement is intentional to ensure that any new rule types
 * added to the DispatchRuleType enum will require explicit handling in this mapper.
 */
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
            case DispatchRuleType.BANK_ACCOUNT:
                return AccountDispatchRule.fromDto(dto);
            case DispatchRuleType.BANK_COUNTERPART:
                return CounterpartDispatchRule.fromDto(dto);
            case DispatchRuleType.BANK_MOVEMENT_TYPE:
                return MovementTypeDispatchRule.fromDto(dto);
            case DispatchRuleType.BANK_CAUSAL:
                return CausalDispatchRule.fromDto(dto);
            case DispatchRuleType.COMBINED:
                return CombinedDispatchRule.fromDto(dto);
            case DispatchRuleType.PAYMENT_METHOD:
                return PaymentMethodDispatchRule.fromDto(dto);
            case DispatchRuleType.INVOICE_ISSUER:
                return IssuerDispatchRule.fromDto(dto);
            case DispatchRuleType.INVOICE_RECIPIENT:
                return RecipientDispatchRule.fromDto(dto);
            // NEVER add a default statement. This will allow to notice a missing case.
        }
    }
}