export class DailyTransactionRecord {
    id: number;
    parentStatementItemId: number;
    date: Date;
    total: number;
    transactionId: string;

    constructor(
        id: number,
        parentStatementItemId: number,
        date: Date,
        total: number,
        transactionId: string,
    ) {
        this.id = id;
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
        this.transactionId = transactionId;
    }

    toDto(): DailyTransactionRecordDto {
        return {
            id: this.id,
            parentStatementItemId: this.parentStatementItemId,
            date: this.date.toISOString(),
            total: this.total,
            transactionId: this.transactionId
        };
    }

    static fromDto(dto: DailyTransactionRecordDto): DailyTransactionRecord {
        return new DailyTransactionRecord(
            dto.id,
            dto.parentStatementItemId,
            new Date(dto.date),
            dto.total,
            dto.transactionId
        );
    }
}

export type DailyTransactionRecordPersisted = {
    id: number;
    parentStatementItemId: number;
    date: string;
    total: number;
    transactionId: string;
}

export type DailyTransactionRecordDto = {
    id: number;
    parentStatementItemId: number;
    date: string;
    total: number;
    transactionId: string;
}
