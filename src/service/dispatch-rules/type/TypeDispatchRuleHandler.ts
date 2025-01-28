import { AccountingTransaction } from "../../../models/types/accounting-transaction/AccountingTransaction";
import { TypeDispatchRule } from "../../../models/types/dispatch-rules/TypeDispatchRule";
import { DispatchRuleHandler } from "../DispatchRuleHandler";

export class TypeDispatchRuleHandler<
    R extends TypeDispatchRule,
    A extends AccountingTransaction = AccountingTransaction, 
> extends DispatchRuleHandler<TypeDispatchRule, A> {
    assert(rule: R, trx: A): boolean {
        return trx.Header.TypeCode === rule.txType
    }

    getContributions(rule: R, trx: A): number {
        return trx.Header.TotalAmount || 0;
    }
}
