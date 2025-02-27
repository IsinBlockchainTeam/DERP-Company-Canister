import { IDL, query, update } from "azle";
import { IDLCustomDate } from "../models/IDLs/accounting-transaction/IDLAccountingTransaction";
import { IDLTicketAccountingTransaction } from "../models/IDLs/accounting-transaction/IDLTicketAccountingTransaction";
import { IDLStatementItem, IDLStatementItemAggregate } from "../models/IDLs/statement-items/StatementItem";
import { IDLStatementItemCategory } from "../models/IDLs/statement-items/StatementItemCategory";
import { CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";
import { TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { StatementItem, StatementItemAggregateDto, StatementItemDto } from "../models/types/statement-items/StatementItem";
import { StatementItemCategory } from "../models/types/statement-items/StatementItemCategory";
import { AccountingTransactionService } from "../service/AccountingTransactionService";
import { StatementItemService } from "../service/StatementItemService";

class StatementItemsController {
    @query([], IDL.Vec(IDLStatementItemCategory))
    async getStatementItemCategories(): Promise<StatementItemCategory[]> {
        const statementItemService = new StatementItemService();
        return statementItemService.getStatementItemCategories();
    }

    @query([IDL.Int32], IDLStatementItem)
    async getStatementItem(id: number): Promise<StatementItemDto> {
        const statementItemService = new StatementItemService();
        const statementItem = statementItemService.getStatementItemById(id);
        if (!statementItem) {
            throw new Error(`Statement item with id ${id} not found`);
        }

        return statementItem.toDto();
    }

    @query([IDL.Opt(IDL.Int32)], IDL.Vec(IDLStatementItem))
    async getStatementItems(categoryId: [number] | []): Promise<StatementItemDto[]> {
        const statementItemService = new StatementItemService();
        const statementItems = statementItemService.getAllStatementItems(
            categoryId.length > 0 ? categoryId[0] : undefined
        );

        return statementItems.map((item) => {
            return item.toDto();
        });
    }

    @query([IDL.Int32, IDL.Int32, IDL.Opt(IDL.Int32), IDL.Opt(IDL.Int32)], IDLStatementItemAggregate)
    async getStatementItemAggregate(statementItemId: number, year: number, month: [number], day: [number]): Promise<StatementItemAggregateDto> {
        const statementItemService = new StatementItemService();

        const aggregate = statementItemService.getStatementItemAggregate(statementItemId, {
            year,
            month: month.length > 0 ? month[0] : undefined, 
            day: day.length > 0 ? day[0] : undefined
        });

        if (!aggregate) {
            throw new Error(`Aggregate for statement item with id ${statementItemId} not found`);
        }

        return aggregate.toDto();
    }

    @query([IDL.Int32, IDL.Int32, IDL.Opt(IDL.Int32), IDL.Opt(IDL.Int32)], IDL.Vec(IDLStatementItemAggregate))
    async getStatementItemAggregates(statementItemId: number, year: number, month: [number], day: [number]): Promise<StatementItemAggregateDto[]> {
        const statementItemService = new StatementItemService();

        const aggregates = statementItemService.getStatementItemAggregates(statementItemId, {
            year,
            month: month.length > 0 ? month[0] : undefined,
            day: day.length > 0 ? day[0] : undefined
        });

        if (!aggregates) {
            throw new Error(`Aggregate for statement item with id ${statementItemId} not found`);
        }

        return aggregates.map(a => a.toDto());
    }

    @query([IDL.Int32, IDLCustomDate], IDL.Vec(IDLTicketAccountingTransaction))
    async getDailyStatementItemTransactions(statementItemId: number, date: CustomDate): Promise<TicketAccountingTransactionDto[]> {
        const statementItemService = new StatementItemService();
        const accountingTransactionService = new AccountingTransactionService();
        const dailyRecords = statementItemService.getDailyTransactionRecords(statementItemId, date);

        return dailyRecords.map((record) => {
            const transaction = accountingTransactionService.getTicketAccountingTransactionById(record.transactionId);
            if (!transaction) {
                throw new Error(`Transaction with id ${record} not found`);
            }
            return transaction.toDto();
        })
    }

    @update([IDL.Text], IDLStatementItemCategory)
    async storeStatementItemCategory(name: string): Promise<StatementItemCategory> {
        const statementItemService = new StatementItemService();
        return statementItemService.storeStatementItemCategory(name);
    }
    
    @update([IDL.Vec(IDL.Text)], IDL.Vec(IDLStatementItemCategory))
    async storeStatementItemCategories(categories: string[]): Promise<StatementItemCategory[]> {
        const statementItemService = new StatementItemService();
        const result: StatementItemCategory[] = [];
        for (const category of categories) {
            const storedCategory = statementItemService.storeStatementItemCategory(category);
            result.push(storedCategory);
        }

        return result;
    }

    @update([IDLStatementItem])
    storeStatementItem(statementItem: StatementItemDto): void {
        const statmentItemService = new StatementItemService();
        return statmentItemService.storeStatementItem(StatementItem.fromDto(statementItem));
    }

    @update([IDL.Vec(IDLStatementItem)])
    async storeStatementItems(items: StatementItemDto[]): Promise<void> {
        const statementItemService = new StatementItemService();
        for (const item of items) {
            statementItemService.storeStatementItem(StatementItem.fromDto(item));
        }
    }
}

export default StatementItemsController;
