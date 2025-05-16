import { AccountingTransactionType } from "../accounting-transaction/AccountingTransaction";

export class DailyTransactionRecord {
    id: number;
    parentStatementItemId: number;
    date: Date;
    total: number;
    transactionId: string;
    txType: AccountingTransactionType;

    constructor(
        id: number,
        parentStatementItemId: number,
        date: Date,
        total: number,
        transactionId: string,
        txType: AccountingTransactionType,
    ) {
        this.id = id;
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
        this.transactionId = transactionId;
        this.txType = txType;
    }

    toDto(): DailyTransactionRecordDto {
        return {
            id: this.id,
            parentStatementItemId: this.parentStatementItemId,
            date: this.date.toISOString(),
            total: this.total,
            transactionId: this.transactionId,
            txType: this.txType,
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
}

export type DailyTransactionRecordDto = {
    id: number;
    parentStatementItemId: number;
    date: string;
    total: number;
    transactionId: string;
    txType: AccountingTransactionType;
}
