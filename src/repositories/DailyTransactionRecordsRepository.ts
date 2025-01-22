import { StableBTreeMap } from "azle";
import { DailyTransactionRecord, DailyTransactionRecordPersisted } from "../models/types/statement-items/DailyTransactionRecord";
import { StableTreeMapIds } from "./Utils";
import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";

export class DailyTransactionRecordsRepository {
    public static _instance: DailyTransactionRecordsRepository;

    // parentStatementId+$+date -> id[] (DailyStatementItemTransactionRecord ids)
    private _dailyTransactionRecordsByStatement = StableBTreeMap<string, number[]>(StableTreeMapIds.DailyTransactionRecordStatementIndex);
    

    // id -> DailyStatementTransactionRecord
    private _dailyTransactionRecordsById = StableBTreeMap<number, DailyTransactionRecordPersisted>(StableTreeMapIds.DailyTransactionRecord);

    private constructor() { }

    static get instance() {
        if (!DailyTransactionRecordsRepository._instance) {
            DailyTransactionRecordsRepository._instance = new DailyTransactionRecordsRepository();
        }
        return DailyTransactionRecordsRepository._instance;
    }

    saveDailyTransactionRecord(record: Omit<DailyTransactionRecord, 'id'> | DailyTransactionRecord): DailyTransactionRecord {
        // ID is given should perform update
        if ("id" in record) {
            // check that the record exists
            if (!this._dailyTransactionRecordsById.containsKey(record.id)) {
                throw new Error(`DailyTransactionRecord with id ${record.id} does not exist`);
            }

            // update the record
            this._dailyTransactionRecordsById.insert(record.id, {
                id: record.id,
                date: record.date,
                parentStatementItemId: record.parentStatementItemId,
                total: record.total,
                transactionId: record.transactionId,
            });

            // update the index parentStatementId+$+date -> id[]
            const key = this.extractKey(record);
            const records = this._dailyTransactionRecordsByStatement.get(key) || [];
            if (!records.includes(record.id)) {
                records.push(record.id);
                this._dailyTransactionRecordsByStatement.insert(key, records);
            }

            return record;
        }

        const id = new Number(this._dailyTransactionRecordsById.len()).valueOf() + 1;
        const recordWithId: DailyTransactionRecord = { ...record, id };
        const serializedRecord: DailyTransactionRecordPersisted = {
            id,
            date: recordWithId.date,
            parentStatementItemId: recordWithId.parentStatementItemId,
            total: recordWithId.total,
            transactionId: recordWithId.transactionId,
        };

        this._dailyTransactionRecordsById.insert(id, serializedRecord);

        const key = this.extractKey(recordWithId);
        this._dailyTransactionRecordsByStatement.insert(key, [id]);

        return recordWithId;
    }

    getDailyTransactionRecords(statementId: number, date: CustomDate): DailyTransactionRecord[] {
        const key = this.extractKey({ parentStatementItemId: statementId, date });
        const ids = this._dailyTransactionRecordsByStatement.get(key) || [];
        return ids
            .map((id) => this._dailyTransactionRecordsById.get(id))
            .filter((i) => !!i)
            .map(i => new DailyTransactionRecord(i.id, i.parentStatementItemId, i.date, i.total, i.transactionId));
    }

    getDailyTransactionRecordById(id: number): DailyTransactionRecord | null {
        const record = this._dailyTransactionRecordsById.get(id);
        if (!record) return null;

        return {
            ...record
        }
    }

    private extractKey(record: Pick<DailyTransactionRecord, 'parentStatementItemId' | 'date'> & {
        [key: string]: any
    }): string {
        const date = record.date;
        return `${record.parentStatementItemId}$${date.year}-${date.month}-${date.day}`;
    }
}
