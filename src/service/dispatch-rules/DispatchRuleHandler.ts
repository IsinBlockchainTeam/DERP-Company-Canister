import { AccountingTransaction } from "../../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";

export abstract class DispatchRuleHandler<
    R extends DispatchRule,
    A extends AccountingTransaction, 
> {
    abstract assert(rule: R, trx: A): boolean;
    abstract getContributions(rule: R, trx: A): number;
}
