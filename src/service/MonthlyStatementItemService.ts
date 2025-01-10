import { MonthlyStatementItemPresentable } from "../models/types/statement-items/MonthlyStatementItem";
import { DailyStatementItemService } from "./DailyStatementItemService";
import { StatementItemService } from "./StatementItemService";

export class MonthlyStatementItemService {
    private readonly dailyStatementItemsService = new DailyStatementItemService();
    private readonly statementItemsService = new StatementItemService();

    getMonthlyStatementItems(parentStatementItemId: number, month?: number): MonthlyStatementItemPresentable[] {
        const parentStatementItem = this.statementItemsService.getStatementItemById(parentStatementItemId);
        if (!parentStatementItem) {
            throw new Error(`Statement item with id ${parentStatementItemId} not found`);
        }

        const monthsToFetch = month ? [month] : Array.from({ length: 12 }, (_, i) => i);

        return monthsToFetch.map((m) => {
            const dailyStatementItems = this.dailyStatementItemsService.getDailyStatementItems(parentStatementItem, m);
            const total = dailyStatementItems.reduce((acc, item) => acc + item.total, 0);
            return new MonthlyStatementItemPresentable(parentStatementItemId, m, total);
        });
    }
}
