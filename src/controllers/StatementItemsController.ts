import { IDL, query, update } from "azle";
import { IDLDailyStatementItemPresentable } from "../models/IDLs/statement-items/DailyStatementItem";
import { IDLMonthlyStatementItemPresentable } from "../models/IDLs/statement-items/MonthlyStatementItem";
import { IDLStatementItem, IDLStatementItemPresentable } from "../models/IDLs/statement-items/StatementItem";
import { IDLStatementItemCategory } from "../models/IDLs/statement-items/StatementItemCategory";
import { DailyStatementItemPresentable } from "../models/types/statement-items/DailyStatementItem";
import { MonthlyStatementItemPresentable } from "../models/types/statement-items/MonthlyStatementItem";
import { StatementItem, StatementItemPresentable } from "../models/types/statement-items/StatementItem";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { DailyStatementItemService } from "../service/DailyStatementItemService";
import { MonthlyStatementItemService } from "../service/MonthlyStatementItemService";
import { StatementItemService } from "../service/StatementItemService";

class StatementItemsController {
    @query([], IDL.Vec(IDLStatementItemCategory))
    async getStatementItemCategories(): Promise<StatementItemCategory[]> {
        const statementItemService = new StatementItemService();
        return statementItemService.getStatementItemCategories();
    }

    @update([IDL.Text], IDLStatementItemCategory)
    async storeStatementItemCategory(name: string): Promise<StatementItemCategory> {
        const statementItemService = new StatementItemService();
        return statementItemService.storeStatementItemCategory(name);
    }

    @query([IDL.Int32], IDL.Opt(IDLStatementItemPresentable))
    async getStatementItem(id: number): Promise<StatementItemPresentable | null> {
        const statementItemService = new StatementItemService();
        const statementItem = statementItemService.getStatementItemById(id);
        if (!statementItem) {
            return null;
        }

        const total = statementItemService.getStatementItemTotal(statementItem);
        return statementItem.toPresentable(total);
    }

    @query([IDL.Int32, IDL.Int32], IDL.Vec(IDLStatementItemPresentable))
    async getStatementItems(year: number, categoryId: number): Promise<StatementItemPresentable[]> {
        const statementItemService = new StatementItemService();
        const statementItems = statementItemService.getAllStatementItems(year, categoryId);
        return statementItems.map((item) => {
            const total = statementItemService.getStatementItemTotal(item);
            return item.toPresentable(total);
        });
    }

    @query([IDL.Int32], IDL.Vec(IDLMonthlyStatementItemPresentable))
    async getMonthlyStatementItems(statementItemId: number): Promise<MonthlyStatementItemPresentable[]> {
        const monthlyStatementItemService = new MonthlyStatementItemService();
        return monthlyStatementItemService.getMonthlyStatementItems(statementItemId);
    }

    @query([IDL.Int32, IDL.Opt(IDL.Int16)], IDL.Vec(IDLDailyStatementItemPresentable))
    async getDailyStatementItems(statementItemId: number, month?: number): Promise<DailyStatementItemPresentable[]> {
        const statementItemsService = new StatementItemService();
        const statementItem = statementItemsService.getStatementItemById(statementItemId);
        if (!statementItem) {
            throw new Error(`Statement item with id ${statementItemId} not found`);
        }

        const dailyStatementItemService = new DailyStatementItemService();
        return dailyStatementItemService.getDailyStatementItems(statementItem, month).map(i => i.toPresentable())
    }

    @update([IDLStatementItem])
    storeStatementItem(statementItem: StatementItem): void {
        const statmentItemService = new StatementItemService();
        return statmentItemService.storeStatementItem(statementItem);
    }
}

export default StatementItemsController;
