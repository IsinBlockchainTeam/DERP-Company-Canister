import { AccountingTransactionType, CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";
import { DailyTransactionRecord } from "../models/types/statement-items/DailyTransactionRecord";
import { StatementItem, StatementItemAggregate } from "../models/types/statement-items/StatementItem";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { DailyTransactionRecordsRepository } from "../repositories/DailyTransactionRecordsRepository";
import { StatementItemAggregatesRepository } from "../repositories/StatementItemAggregatesRepository";
import { StatementItemsCategoriesRepository } from "../repositories/StatementItemsCategoriesRepository";
import { StatementItemsRepository } from "../repositories/StatementItemsRepository";

export class StatementItemService {
    private _statementItemsRepository = StatementItemsRepository.instance;
    private _aggregatesRepository = StatementItemAggregatesRepository.instance;
    private _statementItemsCategoriesRepository = StatementItemsCategoriesRepository.instance;
    private _dailyTransactionsRecordRepository: DailyTransactionRecordsRepository = DailyTransactionRecordsRepository.instance;

    storeStatementItemCategory(category: string): StatementItemCategory {
        return this._statementItemsCategoriesRepository.saveStatementItemsCategory(category);
    }

    getStatementItemCategories(): StatementItemCategory[] {
        return this._statementItemsCategoriesRepository.getAllStatementItemsCategories();
    }

    storeStatementItem(item: StatementItem): void {
        const categories = this._statementItemsCategoriesRepository.getAllStatementItemsCategories();

        if (item.category !== undefined && categories.find(c => c.id === item.category) === undefined) {
            throw new Error(`Category ${item.category} is not valid. Available: ${categories.map(c => c.id).join(', ')}`);
        }

        this._statementItemsRepository.saveStatementItem(item);
    }

    updateStatementItem(id: number, item: Omit<StatementItem, 'id'>): void {
        this._statementItemsRepository.updateStatementItem(id, item);
    }

    getAllStatementItems(category?: number): StatementItem[] {
        const statements = this._statementItemsRepository.getStatementItems(category);
        return statements;
    }

    getStatementItemById(id: number): StatementItem | null {
        return this._statementItemsRepository.getStatementItemById(id);
    }

    addStatementItemTransaction(parentStatementItemId: number, date: Date, record: {
        amount: number,
        transactionId: string,
        txType: AccountingTransactionType,
        originalRuleId?: number,
    }): void {
        const parentStatementItem = this.getStatementItemById(parentStatementItemId);
        if (!parentStatementItem) {
            throw new Error(`Statement item with id ${parentStatementItemId} not found`);
        }

        const yearlyAggregate = this._aggregatesRepository.getStatementItemAggregate(parentStatementItemId, { year: date.getUTCFullYear() }) || new StatementItemAggregate(parentStatementItemId, 0, date.getUTCFullYear());
        const monthlyAggregate = this._aggregatesRepository.getStatementItemAggregate(parentStatementItemId, { year: date.getUTCFullYear(), month: date.getUTCMonth() }) || new StatementItemAggregate(parentStatementItemId, 0, date.getUTCFullYear(), date.getUTCMonth());
        const dailyAggregate = this._aggregatesRepository.getStatementItemAggregate(parentStatementItemId, {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            day: date.getUTCDate()
        }) || new StatementItemAggregate(parentStatementItemId, 0, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

        yearlyAggregate.total += record.amount;
        monthlyAggregate.total += record.amount;
        dailyAggregate.total += record.amount;

        const dailyTransactionRecord = new DailyTransactionRecord(0, parentStatementItemId, date, record.amount, record.transactionId, record.txType, record.originalRuleId);
        this._dailyTransactionsRecordRepository.saveDailyTransactionRecord(dailyTransactionRecord);

        this._aggregatesRepository.saveStatementItemAggregate(yearlyAggregate);
        this._aggregatesRepository.saveStatementItemAggregate(monthlyAggregate);
        this._aggregatesRepository.saveStatementItemAggregate(dailyAggregate);
    }
    
    removeStatementItemTransaction(recordId: number): void {
        const dailyTransactionRecord = this._dailyTransactionsRecordRepository.getDailyTransactionRecordById(recordId);
        if (!dailyTransactionRecord) {
            throw new Error(`Daily transaction record with id ${recordId} not found`);
        }

        // Update aggregates FIRST, before removing the record
        const yearlyAggregate = this._aggregatesRepository.getStatementItemAggregate(dailyTransactionRecord.parentStatementItemId, { year: dailyTransactionRecord.date.getUTCFullYear() });
        if (yearlyAggregate) {
            yearlyAggregate.total -= dailyTransactionRecord.total;
            this._aggregatesRepository.saveStatementItemAggregate(yearlyAggregate);
        }

        const monthlyAggregate = this._aggregatesRepository.getStatementItemAggregate(dailyTransactionRecord.parentStatementItemId, { year: dailyTransactionRecord.date.getUTCFullYear(), month: dailyTransactionRecord.date.getUTCMonth() });
        if (monthlyAggregate) {
            monthlyAggregate.total -= dailyTransactionRecord.total;
            this._aggregatesRepository.saveStatementItemAggregate(monthlyAggregate);
        }

        const dailyAggregate = this._aggregatesRepository.getStatementItemAggregate(dailyTransactionRecord.parentStatementItemId, {
            year: dailyTransactionRecord.date.getUTCFullYear(),
            month: dailyTransactionRecord.date.getUTCMonth(),
            day: dailyTransactionRecord.date.getUTCDate()
        });
        if (dailyAggregate) {
            dailyAggregate.total -= dailyTransactionRecord.total;
            this._aggregatesRepository.saveStatementItemAggregate(dailyAggregate);
        }

        // Remove the transaction record LAST, after all aggregates are successfully updated
        this._dailyTransactionsRecordRepository.removeDailyTransactionRecord(recordId);
    }
    
    moveStatementItemTransaction(recordId: number, targetStatementItemId: number, originalRuleId?: number): void {
        const dailyTransactionRecord = this._dailyTransactionsRecordRepository.getDailyTransactionRecordById(recordId);
        if (!dailyTransactionRecord) {
            throw new Error(`Daily transaction record with id ${recordId} not found`);
        }

        const targetStatementItem = this.getStatementItemById(targetStatementItemId);
        if (!targetStatementItem) {
            throw new Error(`Statement item with id ${targetStatementItemId} not found`);
        }

        this.addStatementItemTransaction(
            targetStatementItemId,
            dailyTransactionRecord.date,
            {
                amount: dailyTransactionRecord.total,
                transactionId: dailyTransactionRecord.transactionId,
                txType: dailyTransactionRecord.txType,
                originalRuleId: originalRuleId
            }
        );

        this.removeStatementItemTransaction(recordId);
    }
    
    getStatementItemAggregate(parentStatementItemId: number, date: Partial<CustomDate> & Pick<CustomDate, 'year'>): StatementItemAggregate | null {
        return this._aggregatesRepository.getStatementItemAggregate(parentStatementItemId, date);
    }

    getStatementItemAggregates(parentStatementItemId: number, date: Partial<CustomDate> & Pick<CustomDate, 'year'>): StatementItemAggregate[] {
        if (date.month !== undefined && date.day !== undefined) {
            const item = this.getStatementItemAggregate(parentStatementItemId, date);
            if (item) {
                return [item];
            } else {
                return [];
            }
        } else if (date.month !== undefined) {
            // loop through all days of the month stated in date.month
            const numDays = new Date(date.year, date.month + 1, 0).getUTCDate();
            const aggregates: StatementItemAggregate[] = [];
            for (let i = 1; i <= numDays; i++) {
                const day = this.getStatementItemAggregate(parentStatementItemId, { year: date.year, month: date.month, day: i });
                if (day) {
                    aggregates.push(day);
                }
            }

            return aggregates;
        } else {
            // loop through all months of the year stated in date.year
            const aggregates: StatementItemAggregate[] = [];
            for (let i = 0; i <= 11; i++) {
                const month = this.getStatementItemAggregate(parentStatementItemId, { year: date.year, month: i });
                if (month) {
                    aggregates.push(month);
                }
            }

            return aggregates;
        }
    }

    getDailyTransactionRecordIds(parentStatementItemId: number, date: Date): number[] {
        return this._dailyTransactionsRecordRepository.getDailyTransactionRecordIds(parentStatementItemId, date);
    }

    getDailyTransactionRecordsByIds(ids: number[]): DailyTransactionRecord[] {
        const records = this._dailyTransactionsRecordRepository.getDailyTransactionRecordsByIds(ids);
        return records;
    }
}
