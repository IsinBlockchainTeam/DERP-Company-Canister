import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { PaymentMethodDispatchRule } from "../../../models/types/dispatch-rules/ticket/PaymentMethodDispatchRule";
import { PaymentMethodDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/PaymentMethodDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class PaymentMethodDispatchRuleService extends BaseDispatchRuleService<PaymentMethodDispatchRule> {
    public readonly paymentMethodBasedRepository: PaymentMethodDispatchRuleIndexRepository = PaymentMethodDispatchRuleIndexRepository.instance;
    public readonly ruleType = DispatchRuleType.PAYMENT_METHOD;
    
    public onCreate(rule: PaymentMethodDispatchRule): void {
        this.paymentMethodBasedRepository.addRuleIdToPaymentMethod(rule.paymentMethodId, rule.id!);
    }

    public onUpdate(currentRule: PaymentMethodDispatchRule, newRule: PaymentMethodDispatchRule): void {
        if (currentRule.paymentMethodId !== newRule.paymentMethodId) {
            this.paymentMethodBasedRepository.removeRuleIdFromPaymentMethod(currentRule.paymentMethodId, currentRule.id!);
            this.paymentMethodBasedRepository.addRuleIdToPaymentMethod(newRule.paymentMethodId, newRule.id!);
        }
    }
    
    public mapToConcreteRule(rule: DispatchRule): PaymentMethodDispatchRule {
        return new PaymentMethodDispatchRule(
            rule.id,
            rule.statementItemIDs,
            (rule as PaymentMethodDispatchRule).paymentMethodId,
            (rule as PaymentMethodDispatchRule).storeId,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.paymentMethodId.length < 1) {
            throw new Error("PaymentMethod dispatch rule must have exactly one payment method ID");
        }

        if (ruleDto.storeId.length < 1) {
            throw new Error("PaymentMethod dispatch rule must have exactly one store id");
        }
    }

    public listByPaymentMethod(paymentMethodId: string) {
        return this.paymentMethodBasedRepository.getDispatchRuleIdsForPaymentMethod(paymentMethodId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as PaymentMethodDispatchRule[];
    }
} 