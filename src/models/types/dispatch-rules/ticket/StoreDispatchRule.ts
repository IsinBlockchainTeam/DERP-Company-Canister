import { AccountingTransactionType } from "../../accounting-transaction/AccountingTransaction";
import { DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { TypeDispatchRule } from "../TypeDispatchRule";

export class StoreDispatchRule extends TypeDispatchRule {
    public storeId: number;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        storeId: number,
        dispatchRuleType = DispatchRuleType.STORE,
    ) {
        super(id, statementItemIDs, AccountingTransactionType.TICKET, dispatchRuleType);
        this.storeId = storeId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            storeId: [this.storeId],
        }
    }
}
