export class DailyStatementItem {
    parentStatementItemId: number;
    date: Date;
    total: number;
    transactionIds: string[] = [];

    constructor(
        parentStatementItemId: number,
        date: Date,
        total: number,
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
    }

    toPresentable(): DailyStatementItemPresentable {
        return new DailyStatementItemPresentable(
            this.parentStatementItemId,
            this.date.toISOString(),
            this.total,
        );
    }
}

export class DailyStatementItemPresentable {
    parentStatementItemId: number;
    date: string;
    total: number;

    constructor(
        parentStatementItemId: number,
        date: string,
        total: number,
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.date = date;
        this.total = total;
    }
}
