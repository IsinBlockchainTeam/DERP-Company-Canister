import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "./Utils";
import { StatementItem } from "../models/types/statement-items/StatementItem";

export class StatementItemsRepository {
    private static _instance: StatementItemsRepository;
    
    // category -> ID[]
    private _statementItemIDs = StableBTreeMap<
        string,
        number[]
    >(StableTreeMapIds.StatementItemsYearCategoryIndex);

    // ID -> StatementItem
    private _statementItems = StableBTreeMap<
        number,
        StatementItem
    >(StableTreeMapIds.StatementItems);

    private constructor() {}

    static get instance() {
        if (!StatementItemsRepository._instance) {
            StatementItemsRepository._instance = new StatementItemsRepository();
        }
        return StatementItemsRepository._instance;
    }
    
    saveStatementItem(item: StatementItem): void {
        const existing = this._statementItems.get(item.id);
        if (existing) {
            throw new Error(`Statement item with id ${item.id} already exists`);
        }

        let key = `${item.category}`;
        const categoryIDs = this._statementItemIDs.get(key) || [];
        categoryIDs.push(item.id);

        this._statementItems.insert(item.id, item);
        this._statementItemIDs.insert(key, categoryIDs);
    }
    
    getStatementItems(category?: number): StatementItem[] {
        let key = `${category}`;
        const ids = this._statementItemIDs.get(key) || [];
        return ids
            .map((id) => this._statementItems.get(id))
            .filter((i) => !!i)
            .map(i => new StatementItem(i.id, i.name, i.currency, i.category));
    }

    getStatementItemById(id: number): StatementItem | null {
        const item = this._statementItems.get(id);
        if(!item) return null;

        return new StatementItem(item.id, item.name, item.currency, item.category);
    }
}
