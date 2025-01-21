import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";
import { StatementItem } from "../models/types/statement-items/StatementItem";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { StatementItemsCategoriesRepository } from "../repositories/StatementItemsCategoriesRepository";
import { StatementItemsRepository } from "../repositories/StatementItemsRepository";
import { MonthlyStatementItemService } from "./MonthlyStatementItemService";

export class StatementItemService {
    private _statementItemsRepository = StatementItemsRepository.instance;
    private _statementItemsCategoriesRepository = StatementItemsCategoriesRepository.instance;

    storeStatementItemCategory(category: string): StatementItemCategory {
        return this._statementItemsCategoriesRepository.saveStatementItemsCategory(category);
    }

    getStatementItemCategories(): StatementItemCategory[] {
        return this._statementItemsCategoriesRepository.getAllStatementItemsCategories();
    }

    storeStatementItem(item: StatementItem): void {
        const categories = this._statementItemsCategoriesRepository.getAllStatementItemsCategories();

        if (categories.find(c => c.id === item.category) === undefined) {
            throw new Error(`Category ${item.category} is not valid. Available: ${categories.map(c => c.id).join(', ')}`);
        }

        this._statementItemsRepository.saveStatementItem(item);
    }

    addTransactionContributions(parentStatementItemId: number, date: CustomDate, record: {
        amount: number,
        transactionId: string,
    }): void {
        const parentStatementItem = this.getStatementItemById(parentStatementItemId);
        if (!parentStatementItem) {
            throw new Error(`Statement item with id ${parentStatementItemId} not found`);
        }

        const monthlyService = new MonthlyStatementItemService();
        monthlyService.addTransactionContributions(parentStatementItem, date, record);
    }

    getStatementItemTotal(statementItem: StatementItem): number {
        const monthlyStatementItemService = new MonthlyStatementItemService();
        const monthlyItems = monthlyStatementItemService.getMonthlyStatementItems(statementItem.id);
        return monthlyItems.reduce((acc, item) => acc + item.total, 0);
    }

    getAllStatementItems(year: number, category: number): StatementItem[] {
        const statements = this._statementItemsRepository.getStatementItems(year, category);
        return statements;
    }

    getStatementItemById(id: number): StatementItem | null {
        return this._statementItemsRepository.getStatementItemById(id);
    }
}
