import { StableBTreeMap } from "azle";
import { DailyTransactionRecord } from "../models/types/statement-items/DailyTransactionRecord";
import { StableTreeMapIds } from "./Utils";

export class DailyTransactionRecordsRepository {
    public static _instance: DailyTransactionRecordsRepository;

    // parentStatementId+$+date -> id[] (DailyStatementItemTransactionRecord ids)
    private _dailyTransactionRecordsByStatement = StableBTreeMap<string, number[]>(StableTreeMapIds.DailyTransactionRecordStatementIndex);
    

    // id -> DailyStatementTransactionRecord
    private _dailyTransactionRecordsById = StableBTreeMap<number, DailyTransactionRecord>(StableTreeMapIds.DailyTransactionRecord);

    private constructor() { }

    static get instance() {
        if (!DailyTransactionRecordsRepository._instance) {
            DailyTransactionRecordsRepository._instance = new DailyTransactionRecordsRepository();
        }
        return DailyTransactionRecordsRepository._instance;
    }

    saveDailyTransactionRecord(record: Omit<DailyTransactionRecord, 'id'> | DailyTransactionRecord): DailyTransactionRecord {
        if ("id" in record) {
            if (!this._dailyTransactionRecordsById.containsKey(record.id)) {
                throw new Error(`DailyTransactionRecord with id ${record.id} does not exist`);
            }

            this._dailyTransactionRecordsById.insert(record.id, record);

            const key = `${record.parentStatementItemId}$${record.date.toISOString()}`;
            const records = this._dailyTransactionRecordsByStatement.get(key) || [];
            if (!records.includes(record.id)) {
                records.push(record.id);
                this._dailyTransactionRecordsByStatement.insert(key, records);
            }

            return record;
        }

        const id = new Number(this._dailyTransactionRecordsById.len()).valueOf() + 1;
        const recordWithId: DailyTransactionRecord = { ...record, id };
        console.log("inserting", JSON.stringify(recordWithId));
        this._dailyTransactionRecordsById.insert(id, recordWithId);
        console.log("inserting", `${record.parentStatementItemId}$${record.date.toISOString()}`, [id]);
        this._dailyTransactionRecordsByStatement.insert(`${record.parentStatementItemId}$${record.date.toISOString()}`, [id]);

        console.log("Saved daily transaction record", recordWithId);
        return recordWithId;
    }

    getDailyTransactionRecords(statementId: number, date: Date): DailyTransactionRecord[] {
        const key = `${statementId}$${date.toISOString()}`;
        const ids = this._dailyTransactionRecordsByStatement.get(key) || [];
        return ids
            .map((id) => this._dailyTransactionRecordsById.get(id))
            .filter((i) => !!i)
            .map(i => new DailyTransactionRecord(i.id, i.parentStatementItemId, i.date, i.total, i.transactionId));
    }

    getDailyTransactionRecordById(id: number): DailyTransactionRecord | null {
        return this._dailyTransactionRecordsById.get(id);
    }
}
