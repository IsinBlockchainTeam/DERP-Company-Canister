import { DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { StoreDispatchRule } from "./StoreDispatchRule";
import { AccountingOperation } from "../AccountingOperation";

export class VatGroupDispatchRule extends StoreDispatchRule {
    public vatGroupId: string;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        vatGroupId: string,
        storeId: number,
        accountingOperation: AccountingOperation,
        dispatchRuleType: DispatchRuleType = DispatchRuleType.VAT_GROUP,
    ) {
        super(id, statementItemIDs, storeId, accountingOperation, dispatchRuleType);
        this.vatGroupId = vatGroupId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            vatGroupId: [this.vatGroupId],
        }
    }
}
