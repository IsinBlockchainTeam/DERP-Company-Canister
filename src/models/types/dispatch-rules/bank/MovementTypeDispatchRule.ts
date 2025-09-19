import {AccountingTransactionType} from "../../accounting-transaction/AccountingTransaction";
import {BankTransactionType} from "../../accounting-transaction/BankAccountingTransactionDto";
import {AccountingOperation} from "../AccountingOperation";
import {DispatchRuleDto} from "../DispatchRule";
import {DispatchRuleType} from "../DispatchRuleTypes";
import {TypeDispatchRule} from "../TypeDispatchRule";

export class MovementTypeDispatchRule extends TypeDispatchRule {
    public movementType: BankTransactionType;
    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        accountingOperation: AccountingOperation,
        movementType: BankTransactionType,
        validFrom?: Date,
        validTo?: Date,
    ) {
        super(id, statementItemIDs, AccountingTransactionType.BANK_TRX, accountingOperation, validFrom, validTo, DispatchRuleType.BANK_MOVEMENT_TYPE);
        this.movementType = movementType;
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            movementType: [this.movementType],
        }
    }
  
    static fromDto(dto: DispatchRuleDto): MovementTypeDispatchRule {
        return new MovementTypeDispatchRule(
            dto.id,
            dto.statementItemIDs,
            AccountingOperation.CREDIT,
            dto.movementType[0] as BankTransactionType,
            dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
            dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
        );
    }
}