import { StableBTreeMap } from "azle";
import { DailyStatementItem } from "../models/types/statement-items/DailyStatementItem";
import { StatementItem } from "../models/types/statement-items/StatementItem";
import { StatementItemsRepository } from "./StatementItemsRepository";
import { StableTreeMapIds } from "./Utils";

export class DailyStatementItemRepository {
    private static _instance: DailyStatementItemRepository;

    // parentStatementItemID + $ + date -> DailyStatementItem
    private _dailyStatementItemsByDate = StableBTreeMap<string, DailyStatementItem>(StableTreeMapIds.DailyStatementItemsDateIndex);

    // parentStatementItemID + $ + month -> ID[]
    private _dailyStatementItemsByMonth = StableBTreeMap<string, string[]>(StableTreeMapIds.DailyStatementItemsMonthIndex);

    // parentStatementItemID -> ID[]
    private _dailyStatementItemsByParent = StableBTreeMap<number, string[]>(StableTreeMapIds.DailyStatementItemsParentIndex);

    private constructor() { }

    static get instance() {
        if (!DailyStatementItemRepository._instance) {
            DailyStatementItemRepository._instance = new DailyStatementItemRepository();
        }
        return DailyStatementItemRepository._instance;
    }


    saveDailyStatementItem(item: DailyStatementItem): void {
        const statementItem = StatementItemsRepository.instance.getStatementItemById(item.parentStatementItemId);
        if (!statementItem) {
            throw new Error(`Statement item with id ${item.parentStatementItemId} does not exist`);
        }

        const {id, monthKey, parentKey} = this.extractKey(item);

        // Check if already exists, and update in case
        const existing = this._dailyStatementItemsByDate.get(id);
        this._dailyStatementItemsByDate.insert(id, item);

        // If it was not existing, we also need to create the indexes
        if (!existing) {
            this._dailyStatementItemsByDate.insert(id, item);

            // Save by month
            const monthItems = this._dailyStatementItemsByMonth.get(monthKey) || [];
            monthItems.push(id);
            this._dailyStatementItemsByMonth.insert(monthKey, monthItems);

            // Save by parent
            const parentItems = this._dailyStatementItemsByParent.get(parentKey) || [];
            parentItems.push(id);
            this._dailyStatementItemsByParent.insert(parentKey, parentItems);
        }
    }

    getDailyStatementItems(parentStatementItem: StatementItem, month?: number): DailyStatementItem[] {
        let items = [];
        if (month !== undefined) {
            // Filter by month
            const monthKey = `${parentStatementItem.id}$${month}`;
            const itemsRaw = this._dailyStatementItemsByMonth.get(monthKey) || [];
            items = itemsRaw.map((id) => this._dailyStatementItemsByDate.get(id)!);
        } else {
            // Get all
            const parentKey = parentStatementItem.id;
            const itemsRaw = this._dailyStatementItemsByParent.get(parentKey) || [];
            items = itemsRaw.map((id) => this._dailyStatementItemsByDate.get(id)!);
        }

        return items.map(i => new DailyStatementItem(i.parentStatementItemId, i.date, i.total));
    }

    getDailyStatementItem(parentStatementItem: StatementItem, date: Date): DailyStatementItem | null {
        const {id} = this.extractKey({ parentStatementItemId: parentStatementItem.id, date });
        return this._dailyStatementItemsByDate.get(id) || null;
    }

    private extractKey(statementItem: Pick<DailyStatementItem, 'parentStatementItemId' | 'date'> & {
        [key: string]: any
    }): {
        id: string,
        monthKey: string,
        parentKey: number,
    } {
        return {
            id: `${statementItem.parentStatementItemId}$${statementItem.date.toISOString().split('T')[0]}`,
            monthKey: `${statementItem.parentStatementItemId}$${statementItem.date.getMonth()}`,
            parentKey: statementItem.parentStatementItemId,
        }
    }
}
