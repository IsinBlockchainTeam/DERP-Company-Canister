import { DispatchRule, DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { AccountingOperation } from "../AccountingOperation";

export class CounterpartDispatchRule extends DispatchRule {
    public counterpartName: string;

    constructor(
        id: number,
        statementItemIDs: number[],
        accountingOperation: AccountingOperation,
        counterpartName: string,
        validFrom?: Date,
        validTo?: Date,
        dispatchRuleType: DispatchRuleType = DispatchRuleType.BANK_COUNTERPART,
    ) {
        super(id, dispatchRuleType, statementItemIDs, accountingOperation, validFrom, validTo);
        this.counterpartName = counterpartName;
    }

    toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            counterpartName: [this.counterpartName],
        }
    }

    static fromDto(dto: DispatchRuleDto): CounterpartDispatchRule {
        return new CounterpartDispatchRule(
            dto.id,
            dto.statementItemIDs,
            dto.accountingOperation,
            dto.counterpartName[0]!,
            dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
            dto.validTo[0] ? new Date(dto.validTo[0]) : undefined
        );
    }

} 