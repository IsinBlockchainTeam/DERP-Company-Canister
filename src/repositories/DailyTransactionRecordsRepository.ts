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
        if ((record as DailyTransactionRecord).id) {
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

        const id = new Number(this._dailyTransactionRecordsById.len()).valueOf() + 1;
        const recordWithId: DailyTransactionRecord = new DailyTransactionRecord(id, record.parentStatementItemId, record.date, record.total, record.transactionId, record.txType);
        const serializedRecord: DailyTransactionRecordPersisted = recordWithId.toDto();

        this._dailyTransactionRecordsById.insert(id, serializedRecord);

        const key = this.extractKey(recordWithId);
        const currentRecordIds = this._dailyTransactionRecordsByStatement.get(key) || [];
        currentRecordIds.push(id);

        this._dailyTransactionRecordsByStatement.insert(key, currentRecordIds);

        return recordWithId;
    }

    getDailyTransactionRecordIds(statementId: number, date: Date): number[] {
        const dayBefore = new Date(date);   
        dayBefore.setDate(dayBefore.getDate() - 1);
        const dayAfter = new Date(date);
        dayAfter.setDate(dayAfter.getDate() + 1);

        const keyBefore = this.extractKey({ parentStatementItemId: statementId, date: dayBefore });
        const keyAfter = this.extractKey({ parentStatementItemId: statementId, date: dayAfter });
        const key = this.extractKey({ parentStatementItemId: statementId, date });

        const recordsBefore = this._dailyTransactionRecordsByStatement.get(keyBefore) || [];
        const recordsAfter = this._dailyTransactionRecordsByStatement.get(keyAfter) || [];
        const recordsCurrent = this._dailyTransactionRecordsByStatement.get(key) || [];

        return [...recordsBefore, ...recordsCurrent, ...recordsAfter];
    }

    getDailyTransactionRecordsByIds(ids: number[]): DailyTransactionRecord[] {
        // BUG IN MAP: despite each printed record is printed correctly in the "map" function
        // the final "records" array is an array with just one element = 0 (????????????????)
        // const records = ids
        //     .map((id) => {
        //         const record = this._dailyTransactionRecordsById.get(id);
        //         console.log("Record", record);
        //         return record;
        //     });
        // console.log("Records", JSON.stringify(records));
        // console.log("Record", records[0]);
        
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
            parsedRecords.push(new DailyTransactionRecord(record.id, record.parentStatementItemId, new Date(record.date), record.total, record.transactionId, record.txType));
        }

        return parsedRecords;
    }

    getDailyTransactionRecordById(id: number): DailyTransactionRecord | null {
        const record = this._dailyTransactionRecordsById.get(id);
        if (!record) return null;

        return new DailyTransactionRecord(record.id, record.parentStatementItemId, new Date(record.date), record.total, record.transactionId, record.txType);
    }

    private extractKey(record: Pick<DailyTransactionRecord, 'parentStatementItemId' | 'date'> & {
        [key: string]: any
    }): string {
        const date = record.date;
        return `${record.parentStatementItemId}$${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
    }
}
