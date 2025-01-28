import { DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { StoreDispatchRule } from "./StoreDispatchRule";

export class VatGroupDispatchRule extends StoreDispatchRule {
    public vatGroupId: string;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        groupId: string,
        storeId: number,
        dispatchRuleType: DispatchRuleType = DispatchRuleType.VAT_GROUP,
    ) {
        super(id, statementItemIDs, storeId, dispatchRuleType);
        this.vatGroupId = groupId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            vatGroupId: [this.vatGroupId],
        }
    }
}
