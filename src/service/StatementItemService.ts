import { StatementItem } from "../models/types/statement-items/StatementItem";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { StatementItemsCategoriesRepository } from "../repositories/StatementItemsCategoriesRepository";
import { StatementItemsRepository } from "../repositories/StatementItemsRepository";
import { MonthlyStatementItemService } from "./MonthlyStatementItemService";

export class StatementItemService {
    private statementItemsRepository = StatementItemsRepository.instance;
    private statementItemsCategoriesRepository = StatementItemsCategoriesRepository.instance;
    private monthlyStatementItemService = new MonthlyStatementItemService();

    storeStatementItemCategory(category: string): StatementItemCategory {
        return this.statementItemsCategoriesRepository.saveStatementItemsCategory(category);
    }

    getStatementItemCategories(): StatementItemCategory[] {
        return this.statementItemsCategoriesRepository.getAllStatementItemsCategories();
    }

    storeStatementItem(item: StatementItem): void {
        const categories = this.statementItemsCategoriesRepository.getAllStatementItemsCategories();

        if (categories.find(c => c.id === item.category) === undefined) {
            throw new Error(`Category ${item.category} is not valid. Available: ${categories.map(c => c.id).join(', ')}`);
        }

        this.statementItemsRepository.saveStatementItem(item);
    }

    getStatementItemTotal(statementItem: StatementItem): number {
        const monthlyItems = this.monthlyStatementItemService.getMonthlyStatementItems(statementItem.id);
        return monthlyItems.reduce((acc, item) => acc + item.total, 0);
    }

    getAllStatementItems(year: number, category: number): StatementItem[] {
        const statements = this.statementItemsRepository.getStatementItems(year, category);
        console.log("statements: ", statements);
        return statements;
    }

    getStatementItemById(id: number): StatementItem | null {
        return this.statementItemsRepository.getStatementItemById(id);
    }
}
