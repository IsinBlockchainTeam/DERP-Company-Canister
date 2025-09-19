import {AccountingTransactionType} from "../accounting-transaction/AccountingTransaction";
import {DispatchRule, DispatchRuleDto} from "./DispatchRule";
import {DispatchRuleType} from "./DispatchRuleTypes";
import {AccountingOperation} from "./AccountingOperation";

export class TypeDispatchRule extends DispatchRule {
    txType: AccountingTransactionType;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        txType: AccountingTransactionType,
        accountingOperation?: AccountingOperation,
        validFrom?: Date,
        validTo?: Date,
        ruleType: DispatchRuleType = DispatchRuleType.TYPE,
    ) {
        super(id, ruleType, statementItemIDs, accountingOperation, validFrom, validTo);
        this.txType = txType;
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            txType: [this.txType],
        }
    }
    
    static fromDto(dto: DispatchRuleDto): TypeDispatchRule {
        return new TypeDispatchRule(
            dto.id,
            dto.statementItemIDs,
            dto.txType[0]! as AccountingTransactionType,
            AccountingOperation.DEBIT,
            dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
            dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
        );
    }
}
