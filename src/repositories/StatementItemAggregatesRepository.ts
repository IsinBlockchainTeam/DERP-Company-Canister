import { StableBTreeMap } from "azle";
import { StatementItemAggregate } from "../models/types/statement-items/StatementItem";
import { StableTreeMapIds } from "./Utils";
import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";

export class StatementItemAggregatesRepository {
    private _statementItemAggregates = StableBTreeMap<
        string,
        StatementItemAggregate
    >(StableTreeMapIds.StatementItemAggregates);


    private static _instance: StatementItemAggregatesRepository;
    private constructor() {}
    static get instance() {
        if (!StatementItemAggregatesRepository._instance) {
            StatementItemAggregatesRepository._instance = new StatementItemAggregatesRepository();
        }
        return StatementItemAggregatesRepository._instance;
    }

    public saveStatementItemAggregate(aggregate: StatementItemAggregate): StatementItemAggregate {
        const key = this.extractKeys(aggregate);
        this._statementItemAggregates.insert(key, aggregate);
        return aggregate;
    }

    public getStatementItemAggregate(parentStatementItemId: number, date: Partial<CustomDate>): StatementItemAggregate | null {
        const key = this.extractKeys({parentStatementItemId, ...date});
        const raw = this._statementItemAggregates.get(key);
        if(!raw) return null;

        return new StatementItemAggregate(parentStatementItemId, raw.total, raw.year, raw.month, raw.day);
    }

    // will extract the keys to index a statement item aggregate in the repositories
    // WARN: change this method may lead to data loss in the deployed canister
    private extractKeys = (aggregate: Partial<CustomDate> & {parentStatementItemId: number}): string => {
        return `${aggregate.year}+${aggregate.month}+${aggregate.day}+${aggregate.parentStatementItemId}`;
    } 
}
