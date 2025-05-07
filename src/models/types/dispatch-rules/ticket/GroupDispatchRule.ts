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
        validFrom?: Date,
        validTo?: Date,
        dispatchRuleType: DispatchRuleType = DispatchRuleType.GROUP,
    ) {
        super(id, statementItemIDs, storeId, accountingOperation, validFrom, validTo, dispatchRuleType);
        this.groupId = groupId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            groupId: [this.groupId],
        }
    }
    
    static fromDto(dto: DispatchRuleDto): GroupDispatchRule {
        return new GroupDispatchRule(
            dto.id,
            dto.statementItemIDs,
            dto.groupId[0]!,
            dto.storeId[0]!,
            dto.accountingOperation,
            dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
            dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
        );
    }
}
