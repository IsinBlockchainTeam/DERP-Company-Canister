import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class PaymentMethodDispatchRuleIndexRepository {
    private static _instance: PaymentMethodDispatchRuleIndexRepository;

    // payment method ID -> dispatch rule ID
    private _dispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.PaymentMethodDispatchRuleIndex);

    static get instance() {
        if (!PaymentMethodDispatchRuleIndexRepository._instance) {
            PaymentMethodDispatchRuleIndexRepository._instance = new PaymentMethodDispatchRuleIndexRepository();
        }
        return PaymentMethodDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToPaymentMethod(paymentMethodId: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(paymentMethodId) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._dispatchRuleIDs.insert(paymentMethodId, ruleIds);
        }
    }

    removeRuleIdFromPaymentMethod(paymentMethodId: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(paymentMethodId) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._dispatchRuleIDs.insert(paymentMethodId, ruleIds);
        }
    }

    saveRulesForPaymentMethod(paymentMethodId: string, ruleIds: number[]) {
        this._dispatchRuleIDs.insert(paymentMethodId, ruleIds);
    }

    getDispatchRuleIdsForPaymentMethod(paymentMethodId: string): number[] {
        return this._dispatchRuleIDs.get(paymentMethodId) || [];
    }
} 