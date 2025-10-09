import { StableBTreeMap, stableJson } from 'azle';
import { DailyTransactionRecord, DailyTransactionRecordPersisted } from "../models/types/statement-items/DailyTransactionRecord";
import { StableTreeMapIds } from "./Utils";
import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";

export class DailyTransactionRecordsRepository {
    public static _instance: DailyTransactionRecordsRepository;

    // parentStatementId+$+date -> id[] (DailyStatementItemTransactionRecord ids)
    private _dailyTransactionRecordsByStatement = StableBTreeMap<string, number[]>(StableTreeMapIds.DailyTransactionRecordStatementIndex);
    

    // id -> DailyStatementTransactionRecord
    private _dailyTransactionRecordsById = StableBTreeMap<number, DailyTransactionRecordPersisted>(StableTreeMapIds.DailyTransactionRecord,stableJson);

    private constructor() { }

    static get instance() {
        if (!DailyTransactionRecordsRepository._instance) {
            DailyTransactionRecordsRepository._instance = new DailyTransactionRecordsRepository();
        }
        return DailyTransactionRecordsRepository._instance;
    }

    saveDailyTransactionRecord(record: Omit<DailyTransactionRecord, 'id'> | DailyTransactionRecord): DailyTransactionRecord {
        // ID is given should perform update
        if ((record as DailyTransactionRecord).id) {
            console.log(`Updating DailyTransactionRecord with id ${(record as DailyTransactionRecord).id}`);
            // check that the record exists
            if (!this._dailyTransactionRecordsById.containsKey((record as DailyTransactionRecord).id)) {
                throw new Error(`DailyTransactionRecord with id ${(record as DailyTransactionRecord).id} does not exist`);
            }

            // update the record
            this._dailyTransactionRecordsById.insert((record as DailyTransactionRecord).id, (record as DailyTransactionRecord).toDto());

            // update the index parentStatementId+$+date -> id[]
            const key = this.extractKey(record);
            const records = this._dailyTransactionRecordsByStatement.get(key) || [];
            if (!records.includes((record as DailyTransactionRecord).id)) {
                records.push((record as DailyTransactionRecord).id);
                this._dailyTransactionRecordsByStatement.insert(key, records);
            }

            return record as DailyTransactionRecord;
        }
        console.log(this._dailyTransactionRecordsById.len())
        const id = new Number(this._dailyTransactionRecordsById.len()).valueOf() + 800;
        console.log(`Creating DailyTransactionRecord with id ${typeof id}`);
        console.log(`Record: ${JSON.stringify(record)}`);
        const recordWithId: DailyTransactionRecord = new DailyTransactionRecord(id, record.parentStatementItemId, record.date, record.total, record.transactionId, record.txType, record.originalRuleId);
        const serializedRecord: DailyTransactionRecordPersisted = recordWithId.toDto();

        this._dailyTransactionRecordsById.insert(id, serializedRecord);
        console.log(`Inserted record with id ${id}`);
        const key = this.extractKey(recordWithId);
        const currentRecordIds = this._dailyTransactionRecordsByStatement.get(key) || [];
        currentRecordIds.push(id);

        this._dailyTransactionRecordsByStatement.insert(key, currentRecordIds);
        console.log(`Updated index for key ${key} with record ids ${JSON.stringify(currentRecordIds)}`);
        return recordWithId;
    }

    removeDailyTransactionRecord(id: number): void {
        const record = this._dailyTransactionRecordsById.get(id);
        if (!record) {
            throw new Error(`DailyTransactionRecord with id ${id} does not exist`);
        }


        const key = this.extractKey({ parentStatementItemId: record.parentStatementItemId, date: new Date(record.date) });
        const records = this._dailyTransactionRecordsByStatement.get(key) || [];
        records.splice(records.indexOf(id), 1);
        this._dailyTransactionRecordsByStatement.insert(key, records);
        this._dailyTransactionRecordsById.remove(id);
    }

    getDailyTransactionRecordIds(statementId: number, date: Date): number[] {
        const key = this.extractKey({ parentStatementItemId: statementId, date });
        return this._dailyTransactionRecordsByStatement.get(key) || [];
    }

    getDailyTransactionRecordsByIds(ids: number[]): DailyTransactionRecord[] {
        const records = [];
        for (const id of ids) {
            const record = this._dailyTransactionRecordsById.get(id);
            if (record) {
                records.push(record);
            }
        }
        

        const result = records
            .filter((i) => !!i)
        
        let parsedRecords = [];
        for (const record of result) {
            parsedRecords.push(new DailyTransactionRecord(record.id, record.parentStatementItemId, new Date(record.date), record.total, record.transactionId, record.txType, record.originalRuleId.length > 0 ? record.originalRuleId[0] : undefined));
        }

        return parsedRecords;
    }

    getDailyTransactionRecordById(id: number): DailyTransactionRecord | null {
        const record = this._dailyTransactionRecordsById.get(id);
        if (!record) return null;

        return new DailyTransactionRecord(record.id, record.parentStatementItemId, new Date(record.date), record.total, record.transactionId, record.txType, record.originalRuleId.length > 0 ? record.originalRuleId[0] : undefined);
    }

    private extractKey(record: Pick<DailyTransactionRecord, 'parentStatementItemId' | 'date'> & {
        [key: string]: any
    }): string {
        const date = record.date;
        return `${record.parentStatementItemId}$${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
    }
}
