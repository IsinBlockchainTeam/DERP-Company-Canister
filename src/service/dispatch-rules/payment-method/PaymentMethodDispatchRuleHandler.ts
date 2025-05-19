import { TicketAccountingTransaction } from "../../../models/types/accounting-transaction/TicketAccountingTransaction";
import { PaymentMethodDispatchRule } from "../../../models/types/dispatch-rules/ticket/PaymentMethodDispatchRule";
import { StoreDispatchRuleHandler } from "../store/StoreDispatchRuleHandler";

export class PaymentMethodDispatchRuleHandler extends StoreDispatchRuleHandler<
    PaymentMethodDispatchRule,
    TicketAccountingTransaction
> {
    assert(rule: PaymentMethodDispatchRule, trx: TicketAccountingTransaction) {
        if(!super.assert(rule, trx))
            return false;

        if(!trx.PaymentDetails) return false;

        for(const payment of trx.PaymentDetails) {
            if(payment.paymentTypeId === rule.paymentMethodId){
                return true;
            }
        }

        return false;
    }

    getContributions(rule: PaymentMethodDispatchRule, trx: TicketAccountingTransaction) {
        return trx.PaymentDetails?.filter(payment => payment.paymentTypeId === rule.paymentMethodId).reduce((acc, payment) => acc + payment.amount, 0) ?? 0;
    }
} 