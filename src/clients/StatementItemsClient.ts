import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { createActor } from "../declarations/dlterp_company";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { StatementItem, StatementItemAggregate } from "../models/types/statement-items/StatementItem";
import { TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";

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
        const items = await this.actor.getStatementItems(categoryId !== undefined ? [categoryId]: []);
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
     * Get all transactions by statement item id and date
     * @param statementItemId the id of the statement item
     * @param date the date to filter by
     * @returns the list of transactions
     */
    async getStatementItemTransactions(statementItemId: number, date: CustomDate): Promise<TicketAccountingTransaction[]> {
        const resp = await this.actor.getDailyStatementItemTransactions(statementItemId, date);
        return resp.map(t => TicketAccountingTransaction.fromDto(t as TicketAccountingTransactionDto));
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
}
