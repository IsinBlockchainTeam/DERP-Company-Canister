import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { createActor } from "../declarations/dlterp_company";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { StatementItem, StatementItemAggregate } from "../models/types/statement-items/StatementItem";
import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { AccountingTransaction, CustomDate, AccountingTransactionType } from "../models/types/accounting-transaction/AccountingTransaction";
import { DailyTransactionRecord, DailyTransactionRecordDto } from "../models/types/statement-items/DailyTransactionRecord";
import { InvoiceAccountingTransaction } from "../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { BankAccountingTransaction } from "../models/types/accounting-transaction/BankAccountingTransaction";


interface TransactionData {
    record: DailyTransactionRecord;
    transaction: AccountingTransaction;
}


export class StatementItemsClient {
    private readonly actor: ActorSubclass<_SERVICE>

    constructor(serverAddress: string, canisterId: string) {
        const agent = HttpAgent.createSync({ host: serverAddress })
        this.actor = createActor(canisterId, { agent })
    }


    /**
     * Get all statement items categories
     * @returns the list of categories
     */
    async getStatementItemsCategories(): Promise<StatementItemCategory[]> {
        return this.actor.getStatementItemCategories();
    }

    /**
     * Get a statement item by its id
     * @param id the id of the statement item
     * @returns the statement item
     */
    async getStatementItem(id: number): Promise<StatementItem> {
        const item = await this.actor.getStatementItem(id);
        return StatementItem.fromDto(item);
    }

    /**
     * Get all statement items
     * @param categoryId the id of the category to filter by
     * @returns the list of statement items
     */
    async getStatementItems(categoryId?: number): Promise<StatementItem[]> {
        const items = await this.actor.getStatementItems(categoryId !== undefined ? [categoryId] : []);
        return items.map(i => StatementItem.fromDto(i));
    }

    /**
     * Get an aggregate statement by its parent statement id and date
     * @param parentStatementId the id of the parent statement
     * @param date the date to filter by. The provided partial date will determine the aggregation level:
     * - year: an aggregate sum for the whole year
     * - month: an aggregate sum for the whole month
     * - day: an aggregate sum for the whole day
     * @returns the aggregate statement
     */
    async getAggregateStatement(parentStatementId: number, date: Partial<CustomDate> & Pick<CustomDate, 'year'>): Promise<StatementItemAggregate> {
        const resp = await this.actor.getStatementItemAggregate(
            parentStatementId,
            date.year,
            date.month !== undefined ? [date.month] : [],
            date.day !== undefined ? [date.day] : []);

        return StatementItemAggregate.fromDto(resp);
    }

    /**
     * Get all aggregations by parent statement id and date
     * @param parentStatementId the id of the parent statement
     * @param date the date to filter by. The provided partial date will determine the aggregation level:
     * - year: all monthly aggregations for the year
     * - month: all daily aggregations for the month
     * - day: all aggregations for the day
     * @returns the list of aggregate statements
     */
    async getAggregateStatements(parentStatementId: number, date: Partial<CustomDate> & Pick<CustomDate, 'year'>): Promise<StatementItemAggregate[]> {
        const resp = await this.actor.getStatementItemAggregates(
            parentStatementId,
            date.year,
            date.month !== undefined ? [date.month] : [],
            date.day !== undefined ? [date.day] : []);

        return resp.map(StatementItemAggregate.fromDto);
    }

    /**
     * Get all transaction IDs by statement item ID and date
     * @param statementItemId the ID of the statement item
     * @param date the date to filter by
     * @returns the list of transaction record IDs
     */
    async getStatementItemRecordIds(statementItemId: number, date: Date): Promise<number[]> {
        const result = await this.actor.getDailyTransactionRecordIds(statementItemId, date.toISOString());
        return Array.from(result);
    }

    /**
     * Get transactions by record IDs
     * @param recordIds the list of record IDs
     * @returns the list of transactions
     */
    async getTransactionsByRecordIds(recordIds: number[]): Promise<TicketAccountingTransaction[]> {
        const resp = await this.actor.getTransactionsByRecordIds(recordIds);
        return resp.map(t => TicketAccountingTransaction.fromDto(t as TicketAccountingTransactionDto));
    }
    
    /**
     * Move a daily record from a statement item to another
     * @param recordId the ID of the record to move
     * @param targetStatementItemId the ID of the target statement item
     * @param originalRuleId the ID of the original rule
     */
    async moveStatementItemRecord(recordId: number, targetStatementItemId: number, originalRuleId?: number): Promise<void> {
        await this.actor.moveStatementItemTransaction(recordId, targetStatementItemId, originalRuleId ? [originalRuleId] : []);
    }


    /**
     * Get all transactions by statement item ID and date (combined method for easier use)
     * @param statementItemId the ID of the statement item
     * @param date the date to filter by
     * @returns the list of transactions
     */
    async getStatementItemRecordsWithTransactions(statementItemId: number, date: Date, batchSize: number = 50): Promise<{
        record: DailyTransactionRecord,
        transaction: AccountingTransaction,
    }[]> {
        const recordIds = await this.getStatementItemRecordIds(statementItemId, date);

        const batches: number[][] = [];

        for (let i = 0; i < recordIds.length; i += batchSize) {
            batches.push(recordIds.slice(i, i + batchSize));
        }

        const results: {
            record: DailyTransactionRecord,
            transaction: AccountingTransaction,
        }[] = [];
        for (const batch of batches) {
            const records = await this.actor.getDailyTransactionRecordsByIds(batch);
            
            const ticketRecords = records.filter(r => r.txType as AccountingTransactionType === AccountingTransactionType.TICKET);
            const invoiceRecords = records.filter(r => r.txType as AccountingTransactionType === AccountingTransactionType.INVOICE);
            const bankTrxRecords = records.filter(r => r.txType as AccountingTransactionType === AccountingTransactionType.BANK_TRX);
            
            const tickets = await this.actor.getTicketAccountingTransactionByIds(ticketRecords.map(r => r.transactionId));
            const invoices = await this.actor.getInvoiceAccountingTransactionByIds(invoiceRecords.map(r => r.transactionId));
            const bankTrxs = await this.actor.getBankAccountingTransactionByIds(bankTrxRecords.map(r => r.transactionId));
            
            const trx = [...tickets, ...invoices, ...bankTrxs];
            results.push(...trx.map(t => {
                const record = records.find(r => r.transactionId === t.Header.DLTERPId[0])!;
                return {
                    record: DailyTransactionRecord.fromDto(record as DailyTransactionRecordDto),
                    transaction: this.mapTransactionTypeToClass(t.Header.TypeCode as AccountingTransactionType)(t),
                }
            }));
        }

        // const dayStart = new Date(date);
        // dayStart.setHours(0, 0, 0, 0);
        // const dayEnd = new Date(date);
        // dayEnd.setHours(23, 59, 59, 999);

        // const transactions = results.filter(t => t.transaction.Header.IssueDate && t.transaction.Header.IssueDate >= dayStart && t.transaction.Header.IssueDate <= dayEnd);

        return results.map(t => ({
            record: t.record,
            transaction: t.transaction,
        }));
    }

    // async getStatementItemRecordsCSV(statementItemId:number,date: Date): Promise<string | undefined> {
    //     console.log("Export for statement item id:", statementItemId, "on date:", date);
    //     const recordsAndTransactions = await this.getStatementItemRecordsWithTransactions(statementItemId,date);
    //     console.log('Records for export');
    //     console.log(recordsAndTransactions);
    //     try {
    //         const csvContent = convertTransactionsToCSV(recordsAndTransactions);
    //
    //         if (!csvContent) {
    //             console.warn('Nessun dato da esportare');
    //             return undefined;
    //         }
    //         console.log('CSV content generated successfully');
    //         console.log(csvContent);
    //         return csvContent;
    //     } catch (error) {
    //         console.error('Errore durante l\'esportazione del CSV:', error);
    //         throw error;
    //     }
    // }

    /**
     * Updates a statement item given its ID
     * @param id the ID of the statement item
     * @param item the statement item to update
     */
    async updateStatementItem(id: number, item: StatementItem): Promise<void> {
        await this.actor.updateStatementItem(id, item.toDto());
    }


    /**
     * Store a new statement item category
     * @param name the name of the category
     * @returns the created category
     */
    async storeStatementItemsCategory(name: string): Promise<StatementItemCategory> {
        return this.actor.storeStatementItemCategory(name);
    }

    /**
     * Store new statement item categories
     * @param categories the list of categories to store
     */
    async storeStatementItemsCategories(categories: string[]): Promise<StatementItemCategory[]> {
        const chunks = categories.reduce((acc, category, index) => {
            const chunkIndex = Math.floor(index / 100);
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = [];
            }
            acc[chunkIndex].push(category);
            return acc;
        }, [] as string[][]);

        const result: StatementItemCategory[] = [];
        for (const chunk of chunks) {
            const createdCategories = await this.actor.storeStatementItemCategories(chunk);
            result.push(...createdCategories as StatementItemCategory[]);
        }

        return result;
    }

    /**
     * Store a new statement item
     * @param item the statement item to store
     */
    async storeStatementItem(item: StatementItem): Promise<void> {
        await this.actor.storeStatementItem(item.toDto());
    }

    /**
     * Store new statement items
     * @param items the list of items to store
     */
    async storeStatementItems(items: StatementItem[]): Promise<void> {
        const chunks = items.reduce((acc, item, index) => {
            const chunkIndex = Math.floor(index / 100);
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = [];
            }
            acc[chunkIndex].push(item);
            return acc;
        }, [] as StatementItem[][]);

        for (const chunk of chunks) {
            await this.actor.storeStatementItems(chunk.map(i => i.toDto()));
        }
    }

    private mapTransactionTypeToClass(txType: AccountingTransactionType): Function {
        switch (txType) {
            case AccountingTransactionType.TICKET:
                return TicketAccountingTransaction.fromDto;
            case AccountingTransactionType.INVOICE:
                return InvoiceAccountingTransaction.fromDto;
            case AccountingTransactionType.BANK_TRX:
                return BankAccountingTransaction.fromDto;
        }
    }
}
