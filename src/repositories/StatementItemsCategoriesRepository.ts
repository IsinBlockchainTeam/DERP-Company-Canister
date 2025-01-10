import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "./Utils";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";

export class StatementItemsCategoriesRepository {
    private static _instance: StatementItemsCategoriesRepository;
    private _statementItemsCategories = StableBTreeMap<number, string>(StableTreeMapIds.StatementItemsCategory);

    private constructor() { }

    static get instance() {
        if (!StatementItemsCategoriesRepository._instance) {
            StatementItemsCategoriesRepository._instance = new StatementItemsCategoriesRepository();
        }
        return StatementItemsCategoriesRepository._instance;
    }

    saveStatementItemsCategory(name: string): StatementItemCategory {
        const id = Number(this._statementItemsCategories.len()) + 1;
        this._statementItemsCategories.insert(id, name);

        return new StatementItemCategory(id, name);
    }

    updateStatementItemsCategory(id: number, name: string): StatementItemCategory {
        const current = this._statementItemsCategories.get(id);
        if (!current) {
            throw new Error(`Category with id ${id} does not exist`);
        }

        this._statementItemsCategories.insert(id, name);

        return new StatementItemCategory(id, name);
    }

    getAllStatementItemsCategories(): StatementItemCategory[] {
        return this._statementItemsCategories.keys().map((id) =>
            new StatementItemCategory(id, this._statementItemsCategories.get(id)!)
        );
    }
}
