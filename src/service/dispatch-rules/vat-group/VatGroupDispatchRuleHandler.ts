import { TicketAccountingTransaction } from "../../../models/types/accounting-transaction/TicketAccountingTransaction";
import { VatGroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/VatGroupDispatchRule";
import { StoreDispatchRuleHandler } from "../store/StoreDispatchRuleHandler";

export class VatGroupDispatchRuleHandler extends StoreDispatchRuleHandler<
    VatGroupDispatchRule,
    TicketAccountingTransaction
> {
    assert(rule: VatGroupDispatchRule, trx: TicketAccountingTransaction) {
        if(!super.assert(rule, trx))
            return false;

        if(!trx.Tax) return false;

        for(const tax of trx.Tax) {
            if(tax.Id === rule.vatGroupId){
                return true;
            }
        }

        return false;
    }

    getContributions(rule: VatGroupDispatchRule, trx: TicketAccountingTransaction) {
        return trx.Tax?.filter(tax => tax.Id === rule.vatGroupId).reduce((acc, tax) => acc + tax.Amount, 0) ?? 0;
    }
}
