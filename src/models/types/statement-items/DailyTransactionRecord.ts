import { CustomDate } from "../accounting-transaction/AccountingTransaction";

export class DailyTransactionRecord {
    id: number;
    parentStatementItemId: number;
    date: CustomDate;
    total: number;
    transactionId: string;

    constructor(
        id: number,
        parentStatementItemId: number,
        date: CustomDate,
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
    date: {
        year: number;
        month: number;
        day: number;
    };
    total: number;
    transactionId: string;
}
