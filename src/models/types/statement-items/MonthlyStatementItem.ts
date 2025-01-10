export class MonthlyStatementItemPresentable {
    parentStatementItemId: number;
    monthIndex: number;
    total: number;

    constructor(
        parentStatementItemId: number,
        monthIndex: number,
        total: number,
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.monthIndex = monthIndex;
        this.total = total;
    }
}
