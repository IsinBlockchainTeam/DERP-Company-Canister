import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "./Utils";
import { StatementItem } from "../models/types/statement-items/StatementItem";

export class StatementItemsRepository {
    private static _instance: StatementItemsRepository;
    
    // year -> category -> ID
    private _statementItemIDs = StableBTreeMap<
        string,
        number[]
    >(StableTreeMapIds.StatementItems);

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

    saveStatementItem(year: number, item: StatementItem): void {
        const existing = this._statementItems.get(item.id);
        if (existing) {
            throw new Error(`Statement item with id ${item.id} already exists`);
        }   

        let key = `${year}$${item.category}`;
        const categoryAndYearIDs = this._statementItemIDs.get(key) || [];
        categoryAndYearIDs.push(item.id);

        this._statementItems.insert(item.id, item);
        this._statementItemIDs.insert(key, categoryAndYearIDs);
    }
    
    getStatementItems(year: number, category: number): StatementItem[] {
        let key = `${year}$${category}`;
        const ids = this._statementItemIDs.get(key) || [];
        return ids
            .map((id) => this._statementItems.get(id))
            .filter((i) => !!i)
            .map(i => new StatementItem(i.id, i.name, i.category, i.currency));
    }

    getStatementItemById(id: number): StatementItem | null {
        const item = this._statementItems.get(id);
        if(!item) return null;

        return new StatementItem(item.id, item.name, item.category, item.currency);
    }
}
