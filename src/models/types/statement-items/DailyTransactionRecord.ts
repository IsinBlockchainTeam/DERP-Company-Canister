import { AccountingTransactionType } from "../accounting-transaction/AccountingTransaction";

export class DailyTransactionRecord {
    id: number;
    parentStatementItemId: number;
    date: Date;
    total: number;
    transactionId: string;
    txType: AccountingTransactionType;
    originalRuleId: number;

    constructor(
        id: number,
        parentStatementItemId: number,
        date: Date,
        total: number,
        transactionId: string,
        txType: AccountingTransactionType,
        originalRuleId: number,
    ) {
        this.id = id;
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
        this.transactionId = transactionId;
        this.txType = txType;
        this.originalRuleId = originalRuleId;
    }

    toDto(): DailyTransactionRecordDto {
        return {
            id: this.id,
            parentStatementItemId: this.parentStatementItemId,
            date: this.date.toISOString(),
            total: this.total,
            transactionId: this.transactionId,
            txType: this.txType,
            originalRuleId: this.originalRuleId,
        };
    }

    static fromDto(dto: DailyTransactionRecordDto): DailyTransactionRecord {
        return new DailyTransactionRecord(
            dto.id,
            dto.parentStatementItemId,
            new Date(dto.date),
            dto.total,
            dto.transactionId,
            dto.txType,
            dto.originalRuleId,
        );
    }
}

export type DailyTransactionRecordPersisted = {
    id: number;
    parentStatementItemId: number;
    date: string;
    total: number;
    transactionId: string;
    txType: AccountingTransactionType;
    originalRuleId: number;
}

export type DailyTransactionRecordDto = {
    id: number;
    parentStatementItemId: number;
    date: string;
    total: number;
    transactionId: string;
    txType: AccountingTransactionType;
    originalRuleId: number;
}
