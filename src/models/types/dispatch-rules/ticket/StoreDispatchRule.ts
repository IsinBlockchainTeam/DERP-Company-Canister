import { AccountingTransactionType } from "../../accounting-transaction/AccountingTransaction";
import { DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { TypeDispatchRule } from "../TypeDispatchRule";
import { AccountingOperation } from "../AccountingOperation";

export class StoreDispatchRule extends TypeDispatchRule {
    public storeId: number;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        storeId: number,
        accountingOperation: AccountingOperation,
        dispatchRuleType = DispatchRuleType.STORE,
    ) {
        super(id, statementItemIDs, AccountingTransactionType.TICKET, accountingOperation, dispatchRuleType);
        this.storeId = storeId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            storeId: [this.storeId],
        }
    }
}
