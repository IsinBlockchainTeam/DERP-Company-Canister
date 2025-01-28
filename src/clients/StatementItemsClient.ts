import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { createActor } from "../declarations/dlterp_company";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { StatementItem, StatementItemAggregate, StatementItemDto } from "../models/types/statement-items/StatementItem";
import { TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";

export class StatementItemsClient {
    private readonly actor: ActorSubclass<_SERVICE>

    constructor(serverAddress: string, canisterId: string) {
        const agent = HttpAgent.createSync({ host: serverAddress })
        this.actor = createActor(canisterId, { agent })
    }


    async getStatementItemsCategories(): Promise<StatementItemCategory[]> {
        return this.actor.getStatementItemCategories();
    }

    async getStatementItem(id: number): Promise<StatementItemDto> {
        const item = await this.actor.getStatementItem(id);
        return new StatementItemDto(item.id, item.name, item.category, item.currency);
    }

    async getStatementItems(categoryId: number): Promise<StatementItemDto[]> {
        const items = await this.actor.getStatementItems(categoryId);
        return items.map(i => new StatementItemDto(i.id, i.name, i.category, i.currency));
    }

    async getAggregateStatement(parentStatementId: number, date: Partial<CustomDate> & Pick<CustomDate, 'year'>): Promise<StatementItemAggregate> {
        const resp = await this.actor.getStatementItemAggregate(
            parentStatementId, 
            date.year,
            date.month !== undefined ? [date.month] : [], 
            date.day !== undefined ? [date.day] : []);

        return StatementItemAggregate.fromDto(resp);
    }

    async getAggregateStatements(parentStatementId: number, date: Partial<CustomDate> & Pick<CustomDate, 'year'>): Promise<StatementItemAggregate[]> {
        const resp = await this.actor.getStatementItemAggregates(
            parentStatementId, 
            date.year,
            date.month !== undefined ? [date.month] : [], 
            date.day !== undefined ? [date.day] : []);

        return resp.map(StatementItemAggregate.fromDto);
    }

    async getStatementItemTransactions(statementItemId: number, date: CustomDate): Promise<TicketAccountingTransaction[]> {
        const resp = await this.actor.getDailyStatementItemTransactions(statementItemId, date);
        return resp.map(t => TicketAccountingTransaction.fromDto(t as TicketAccountingTransactionDto));
    }

    
    async storeStatementItemsCategory(name: string): Promise<StatementItemCategory> {
        return this.actor.storeStatementItemCategory(name);
    }

    async storeStatementItem(item: StatementItem): Promise<void> {
        await this.actor.storeStatementItem(item);
    }
}
