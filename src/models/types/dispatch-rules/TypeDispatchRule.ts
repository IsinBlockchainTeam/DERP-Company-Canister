import { AccountingTransactionType } from "../accounting-transaction/AccountingTransaction";
import { DispatchRule, DispatchRuleDto } from "./DispatchRule";
import { DispatchRuleType } from "./DispatchRuleTypes";

export class TypeDispatchRule extends DispatchRule {
    txType: AccountingTransactionType;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        txType: AccountingTransactionType,
        ruleType: DispatchRuleType = DispatchRuleType.TYPE,
    ) {
        super(id, ruleType, statementItemIDs);
        this.txType = txType;
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            txType: [this.txType],
        }
    }
}
