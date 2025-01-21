import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";
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

    addTransactionContributions(parentStatementItem: StatementItem, date: CustomDate, record: {
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
        const savedRecord = this._dailyTransactionsRecordRepository.saveDailyTransactionRecord(toSave);
        const dailyStatementItem = this.getDailyStatementItem(parentStatementItem, date);
        if (!dailyStatementItem) {
            console.log("Creating the statment item: ", parentStatementItem.id, date, savedRecord.total);
            this.saveDailyStatementItem(new DailyStatementItem(parentStatementItem.id, date, savedRecord.total, [savedRecord.transactionId]));
            return;
        }

        console.log("Current statement item:", dailyStatementItem);
        
        dailyStatementItem.transactionIds.push(savedRecord.transactionId);
        dailyStatementItem.total += savedRecord.total;
        console.log("Updating the statment item: ", dailyStatementItem);
        this.saveDailyStatementItem(dailyStatementItem);
    }

    getDailyStatementItems(parentStatementItem: StatementItem, month?: number): DailyStatementItem[] {
        return this._dailyStatementItemsRepository.getDailyStatementItems(parentStatementItem, month);
    }

    getDailyStatementItem(parentStatementItem: StatementItem, date: CustomDate): DailyStatementItem | null {
        return this._dailyStatementItemsRepository.getDailyStatementItem(parentStatementItem, date);
    }
}
