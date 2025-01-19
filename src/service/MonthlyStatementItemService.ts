import { DailyTransactionRecord } from "../models/types/statement-items/DailyTransactionRecord";
import { MonthlyStatementItemPresentable } from "../models/types/statement-items/MonthlyStatementItem";
import { StatementItem } from "../models/types/statement-items/StatementItem";
import { DailyStatementItemService } from "./DailyStatementItemService";
import { StatementItemService } from "./StatementItemService";

export class MonthlyStatementItemService {

    getMonthlyStatementItems(parentStatementItemId: number, month?: number): MonthlyStatementItemPresentable[] {
        const dailyStatementItemsService = new DailyStatementItemService();
        const statementItemsService = new StatementItemService();
        const parentStatementItem = statementItemsService.getStatementItemById(parentStatementItemId);
        if (!parentStatementItem) {
            throw new Error(`Statement item with id ${parentStatementItemId} not found`);
        }

        const monthsToFetch = month ? [month] : Array.from({ length: 12 }, (_, i) => i);

        return monthsToFetch.map((m) => {
            const dailyStatementItems = dailyStatementItemsService.getDailyStatementItems(parentStatementItem, m);
            const total = dailyStatementItems.reduce((acc, item) => acc + item.total, 0);
            return new MonthlyStatementItemPresentable(parentStatementItemId, m, total);
        });
    }

    addTransactionContributions(parentStatementItem: StatementItem, date: Date, record: {
        amount: number,
        transactionId: string,
    }): void {
        const dailyStatementItemsService = new DailyStatementItemService();
        dailyStatementItemsService.addTransactionContributions(parentStatementItem, date, record);
    }
}
