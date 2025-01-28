import { AccountingTransaction } from "../../../models/types/accounting-transaction/AccountingTransaction";
import { StoreDispatchRule } from "../../../models/types/dispatch-rules/ticket/StoreDispatchRule";
import { TypeDispatchRuleHandler } from "../type/TypeDispatchRuleHandler";

export abstract class StoreDispatchRuleHandler<R extends StoreDispatchRule, T extends AccountingTransaction> extends TypeDispatchRuleHandler<
    R,
    T
> {
    assert(rule: R, trx: T) {
        if(!super.assert(rule, trx))
            return false;

        if (rule.storeId !== trx.Header.StoreId) {
            return false;
        }

        return true;
    }
}
