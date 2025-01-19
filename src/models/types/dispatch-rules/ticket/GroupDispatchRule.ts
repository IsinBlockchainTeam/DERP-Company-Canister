import { AccountingTransactionType } from "../../accounting-transaction/AccountingTransaction";
import { DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { TypeDispatchRule } from "../TypeDispatchRule";

export class GroupDispatchRule extends TypeDispatchRule {
    public groupId: string;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        groupId: string,
        dispatchRuleType: DispatchRuleType = DispatchRuleType.GROUP,
    ) {
        super(id, statementItemIDs, AccountingTransactionType.TICKET, dispatchRuleType);
        this.groupId = groupId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            groupId: [this.groupId],
        }
    }
}
