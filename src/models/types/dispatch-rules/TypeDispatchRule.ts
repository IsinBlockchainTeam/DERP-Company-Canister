import { AccountingTransactionType } from "../accounting-transaction/AccountingTransaction";
import { DispatchRule, DispatchRuleDto } from "./DispatchRule";
import { DispatchRuleType } from "./DispatchRuleTypes";
import { AccountingOperation } from "./AccountingOperation";

export class TypeDispatchRule extends DispatchRule {
    txType: AccountingTransactionType;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        txType: AccountingTransactionType,
        accountingOperation: AccountingOperation,
        ruleType: DispatchRuleType = DispatchRuleType.TYPE,
    ) {
        super(id, ruleType, statementItemIDs, accountingOperation);
        this.txType = txType;
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            txType: [this.txType],
        }
    }
}
