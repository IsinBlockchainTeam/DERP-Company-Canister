import { IDL, query, update } from "azle";
import { IDLStatementItem, IDLStatementItemPresentable } from "../models/IDLs/statement-items/StatementItem";
import { StatementItem, StatementItemPresentable } from "../models/types/statement-items/StatementItem";
import { StatementItemService } from "../service/StatementItemsService";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { IDLStatementItemCategory } from "../models/IDLs/statement-items/StatementItemCategory";

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

    @query([IDL.Int32, IDL.Int32], IDL.Vec(IDLStatementItemPresentable))
    async getStatementItems(year: number, categoryId: number): Promise<StatementItemPresentable[]> {
        const statementItemService = new StatementItemService();
        const statementItems = statementItemService.getAllStatementItems(year, categoryId);
        return statementItems.map((item) => {
            //TODO: Implement this in the repository
            const itemino = new StatementItem(
                item.id,
                item.name,
                item.category,
                item.currency
            )
            const total = statementItemService.getStatementItemTotal(itemino);
            return itemino.toPresentable(total);
        });
    }

    @update([IDL.Int32, IDLStatementItem])
    storeStatementItem(year: number, statementItem: StatementItem): void {
        const statmentItemService = new StatementItemService();
        return statmentItemService.storeStatementItem(year, statementItem);
    }
}

export default StatementItemsController;
