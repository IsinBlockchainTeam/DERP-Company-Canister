import { AccountingTransaction } from "../../models/types/accounting-transaction/AccountingTransaction";
import { AccountingOperation } from "../../models/types/dispatch-rules/AccountingOperation";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";

export abstract class DispatchRuleHandler<
    R extends DispatchRule,
    A extends AccountingTransaction, 
> {
    abstract assert(rule: R, trx: A): boolean;
    protected abstract getContributions(rule: R, trx: A): number;
    
    getComputedContributions(rule: R, trx: A): number {
        let contributions = this.getContributions(rule, trx);

        if (rule.accountingOperation === AccountingOperation.DEBIT) {
            contributions = -contributions;
        }
        
        return contributions;
    }
}
