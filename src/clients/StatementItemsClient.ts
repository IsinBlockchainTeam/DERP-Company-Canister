import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { createActor } from "../declarations/dlterp_company";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { StatementItem, StatementItemPresentable } from "../models/types/statement-items/StatementItem";
import { MonthlyStatementItemPresentable } from "../models/types/statement-items/MonthlyStatementItem";
import { DailyStatementItemPresentable } from "../models/types/statement-items/DailyStatementItem";
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

    async getStatementItem(id: number): Promise<StatementItemPresentable> {
        const item = await this.actor.getStatementItem(id);
        return new StatementItemPresentable(item.id, item.name, item.category, item.currency, item.year, item.total);
    }

    async getStatementItems(year: number, categoryId: number): Promise<StatementItemPresentable[]> {
        const items = await this.actor.getStatementItems(year, categoryId);
        return items.map(i => new StatementItemPresentable(i.id, i.name, i.category, i.currency, i.year, i.total));
    }

    async getMonthlyStatementItems(statementItemId: number): Promise<MonthlyStatementItemPresentable[]> {
        const items = await this.actor.getMonthlyStatementItems(statementItemId);
        return items.map(i => new MonthlyStatementItemPresentable(i.parentStatementItemId, i.monthIndex, i.total));
    }

    async getDailyStatementItems(statementItemId: number, month?: number): Promise<DailyStatementItemPresentable[]> {
        const items = await this.actor.getDailyStatementItems(statementItemId, month !== undefined ? [month] : []);
        return items.map(i => new DailyStatementItemPresentable(i.parentStatementItemId, i.date, i.total, i.transactionIds));
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
