import { DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { StoreDispatchRule } from "./StoreDispatchRule";
import { AccountingOperation } from "../AccountingOperation";

export class GroupDispatchRule extends StoreDispatchRule {
    public groupId: string;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        groupId: string,
        storeId: number,
        accountingOperation: AccountingOperation,
        dispatchRuleType: DispatchRuleType = DispatchRuleType.GROUP,
    ) {
        super(id, statementItemIDs, storeId, accountingOperation, dispatchRuleType);
        this.groupId = groupId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            groupId: [this.groupId],
        }
    }
}
