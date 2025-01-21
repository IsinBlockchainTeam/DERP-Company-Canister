import { CustomDate } from "../accounting-transaction/AccountingTransaction";

export class DailyStatementItem {
    parentStatementItemId: number;
    date: CustomDate;
    total: number;
    transactionIds: string[] = [];

    constructor(
        parentStatementItemId: number,
        date: CustomDate,
        total: number,
        transactionIds: string[],
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
        this.transactionIds = transactionIds;
    }

    toPresentable(): DailyStatementItemPresentable {
        console.log("Translating this:", this);
        return new DailyStatementItemPresentable(
            this.parentStatementItemId,
            this.date.year + '-' + this.date.month + '-' + this.date.day,
            this.total,
            this.transactionIds,
        );
    }
}

export class DailyStatementItemPresentable {
    parentStatementItemId: number;
    date: string;
    total: number;
    transactionIds: string[] = [];

    constructor(
        parentStatementItemId: number,
        date: string,
        total: number,
        transactionIds: string[] = [],
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
        this.transactionIds = transactionIds;
    }
}

export class DailyStatementItemPersisted {
    parentStatementItemId: number;
    date: {
        year: number;
        month: number;
        day: number;
    };
    total: number;
    transactionIds: string[] = [];

    constructor(
        parentStatementItemId: number,
        date: {
            year: number;
            month: number;
            day: number;
        },
        total: number,
        transactionIds: string[],
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
        this.transactionIds = transactionIds;
    }
}
