import { DailyStatementItem } from "../models/types/statement-items/DailyStatementItem";
import { DailyTransactionRecord } from "../models/types/statement-items/DailyTransactionRecord";
import { StatementItem } from "../models/types/statement-items/StatementItem";
import { DailyStatementItemRepository } from "../repositories/DailyStatementItemRepository";
import { DailyTransactionRecordsRepository } from "../repositories/DailyTransactionRecordsRepository";

export class DailyStatementItemService {
    private _dailyStatementItemsRepository: DailyStatementItemRepository = DailyStatementItemRepository.instance;
    private _dailyTransactionsRecordRepository: DailyTransactionRecordsRepository = DailyTransactionRecordsRepository.instance;

    saveDailyStatementItem(item: DailyStatementItem): void {
        this._dailyStatementItemsRepository.saveDailyStatementItem(item);
    }

    addTransactionContributions(parentStatementItem: StatementItem, date: Date, record: {
        amount: number,
        transactionId: string,
    }): void {
        const toSave: Omit<DailyTransactionRecord, 'id'> = {
            parentStatementItemId: parentStatementItem.id,
            date,
            total: record.amount,
            transactionId: record.transactionId,
        }

        console.log("Adding transaction contributions", toSave);
        console.log("this:", this);
        console.log("repo:", this._dailyTransactionsRecordRepository);

        const savedRecord = this._dailyTransactionsRecordRepository.saveDailyTransactionRecord(toSave);
        const dailyStatementItem = this.getDailyStatementItem(parentStatementItem, date);
        if (!dailyStatementItem) {
            this.saveDailyStatementItem(new DailyStatementItem(parentStatementItem.id, date, savedRecord.total));
            return;
        }

        dailyStatementItem.total += savedRecord.total;
        this.saveDailyStatementItem(dailyStatementItem);
    }

    getDailyStatementItems(parentStatementItem: StatementItem, month?: number): DailyStatementItem[] {
        return this._dailyStatementItemsRepository.getDailyStatementItems(parentStatementItem, month);
    }

    getDailyStatementItem(parentStatementItem: StatementItem, date: Date): DailyStatementItem | null {
        return this._dailyStatementItemsRepository.getDailyStatementItem(parentStatementItem, date);
    }
}
