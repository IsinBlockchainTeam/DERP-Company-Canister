import { AccountingTransaction } from "../models/types/accounting-transaction/AccountingTransaction";
import { DailyStatementItem } from "../models/types/statement-items/DailyStatementItem";
import { StatementItem } from "../models/types/statement-items/StatementItem";
import { DailyStatementItemRepository } from "../repositories/DailyStatementItemRepository";

export class DailyStatementItemService {
    private dailyStatementItemsRepository: DailyStatementItemRepository = DailyStatementItemRepository.instance;

    saveDailyStatementItem(item: DailyStatementItem): void {
        this.dailyStatementItemsRepository.saveDailyStatementItem(item);
    }

    getDailyStatementItems(parentStatementItem: StatementItem, month?: number): DailyStatementItem[] {
        return this.dailyStatementItemsRepository.getDailyStatementItems(parentStatementItem, month);
    }

    getDailyStatementItem(parentStatementItem: StatementItem, date: Date): DailyStatementItem | null {
        return this.dailyStatementItemsRepository.getDailyStatementItem(parentStatementItem, date);
    }
}
