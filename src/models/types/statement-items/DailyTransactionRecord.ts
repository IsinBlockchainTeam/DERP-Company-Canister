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
}

export type DailyTransactionRecordPersisted = {
    id: number;
    parentStatementItemId: number;
    date: string;
    total: number;
    transactionId: string;
}
