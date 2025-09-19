import {AccountingTransactionType} from "../../accounting-transaction/AccountingTransaction";
import {DispatchRuleDto} from "../DispatchRule";
import {DispatchRuleType} from "../DispatchRuleTypes";
import {TypeDispatchRule} from "../TypeDispatchRule";
import {AccountingOperation} from "../AccountingOperation";

export class StoreDispatchRule extends TypeDispatchRule {
    public storeId: number;

    constructor(
        id: number | undefined,
        statementItemIDs: number[],
        storeId: number,
        accountingOperation?: AccountingOperation,
        validFrom?: Date,
        validTo?: Date,
        dispatchRuleType = DispatchRuleType.STORE,
    ) {
        super(id, statementItemIDs, AccountingTransactionType.TICKET, accountingOperation, validFrom, validTo, dispatchRuleType);
        this.storeId = storeId
    }

    override toDto(): DispatchRuleDto {
        return {
            ...super.toDto(),
            storeId: [this.storeId],

        }
    }
    
    static fromDto(dto: DispatchRuleDto): StoreDispatchRule {
        return new StoreDispatchRule(
            dto.id,
            dto.statementItemIDs,
            dto.storeId[0]!,
            AccountingOperation.DEBIT,
            dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
            dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
        );
    }
}
