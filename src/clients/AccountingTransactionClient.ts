import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { createActor } from "../declarations/dlterp_company";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { InvoiceAccountingTransaction } from "../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { BankAccountingTransaction } from "../models/types/accounting-transaction/BankAccountingTransaction";
import { TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { BankAccountingTransactionDTO } from "../models/types/accounting-transaction/BankAccountingTransactionDto";
import { InvoiceAccountingTransactionDTO } from "../models/types/accounting-transaction/InvoiceAccountingTransactionDto";

export class AccountingTransactionClient {
    private readonly actor: ActorSubclass<_SERVICE>

    constructor(serverAddress: string, canisterId: string, private readonly batchSize: number = 50) {
        const agent = HttpAgent.createSync({ host: serverAddress })
        // TODO: remove in prod, security
        agent.fetchRootKey()
        this.actor = createActor(canisterId, { agent })
    }

    async storeTicketTransaction(trx: TicketAccountingTransaction) {
        const dto = trx.toDto();
        return this.actor.storeTicketAccountingTransaction(dto);
    }

    async storeInvoiceTransaction(trx: InvoiceAccountingTransaction) {
        const dto = trx.toDto();
        return this.actor.storeInvoiceAccountingTransaction(dto);
    }

    async storeBankTransaction(trx: BankAccountingTransaction) {
        const dto = trx.toDto();
        return this.actor.storeBankAccountingTransaction(dto);
    }

    async storeTicketTransactions(trxs: TicketAccountingTransaction[]) {
        const dtos = trxs.map(trx => trx.toDto());
        return this.actor.storeTicketAccountingTransactions(dtos);
    }

    async storeInvoiceTransactions(trxs: InvoiceAccountingTransaction[]) {
        const dtos = trxs.map(trx => trx.toDto());
        return this.actor.storeInvoiceAccountingTransactions(dtos);
    }

    async storeBankTransactions(trxs: BankAccountingTransaction[]) {
        const dtos = trxs.map(trx => trx.toDto());
        return this.actor.storeBankAccountingTransactions(dtos);
    }

    async listTicketTransactions(dateFrom?: Date, dateTo?: Date) {
        const ids = await this.getTransactionIds('ticket', dateFrom, dateTo);
        let trxs = await this.getTransactionsByIds('ticket', ids) as TicketAccountingTransaction[];
        
        // if (dateFrom && dateTo) {
        //     trxs = trxs.filter(trx => trx.Header.IssueDate && trx.Header.IssueDate >= dateFrom && trx.Header.IssueDate <= dateTo);
        // }

        return trxs;
    }

    async listInvoiceTransactions(dateFrom?: Date, dateTo?: Date) {
        const ids = await this.getTransactionIds('invoice', dateFrom, dateTo);
        let trxs = await this.getTransactionsByIds('invoice', ids) as InvoiceAccountingTransaction[];
        
        // if (dateFrom && dateTo) {
        //     trxs = trxs.filter(trx => trx.Header.IssueDate && trx.Header.IssueDate >= dateFrom && trx.Header.IssueDate <= dateTo);
        // }

        return trxs;
    }

    async listBankTransactions(dateFrom?: Date, dateTo?: Date) {
        const ids = await this.getTransactionIds('bank', dateFrom, dateTo);
        let trxs = await this.getTransactionsByIds('bank', ids) as BankAccountingTransaction[];
        
        // if (dateFrom && dateTo) {
        //     trxs = trxs.filter(trx => trx.Header.IssueDate && trx.Header.IssueDate >= dateFrom && trx.Header.IssueDate <= dateTo);
        // }

        return trxs;
    }

    async getTicketTransactionById(id: string) {
        const trx = await this.actor.getTicketAccountingTransactionById(id);
        return TicketAccountingTransaction.fromDto(trx as TicketAccountingTransactionDto);
    }

    async getInvoiceTransactionById(id: string) {
        const trx = await this.actor.getInvoiceAccountingTransactionById(id);
        return InvoiceAccountingTransaction.fromDto(trx as InvoiceAccountingTransactionDTO);
    }

    async getBankTransactionById(id: string) {
        const trx = await this.actor.getBankAccountingTransactionById(id);
        return BankAccountingTransaction.fromDto(trx as BankAccountingTransactionDTO);
    }

    /**
     * Get transaction IDs for a specific type and date range
     * ATTENTION: If using timezone different from UTC, this method will probably return transactions that are not in the date range. In that case, filter the results after fetching the transactions.
     * @param type The transaction type ('ticket', 'invoice', or 'bank')
     * @param dateFrom Optional start date filter
     * @param dateTo Optional end date filter
     * @returns List of transaction IDs
     */
    async getTransactionIds(type: 'ticket' | 'invoice' | 'bank', dateFrom?: Date, dateTo?: Date): Promise<string[]> {
        switch (type) {
            case 'ticket':
                return this.actor.getAllTicketAccountingTransactions(
                    dateFrom ? [dateFrom.toISOString()] : [],
                    dateTo ? [dateTo.toISOString()] : []
                );
            case 'invoice':
                return this.actor.getAllInvoiceAccountingTransactions(
                    dateFrom ? [dateFrom.toISOString()] : [],
                    dateTo ? [dateTo.toISOString()] : []
                );
            case 'bank':
                return this.actor.getAllBankAccountingTransactions(
                    dateFrom ? [dateFrom.toISOString()] : [],
                    dateTo ? [dateTo.toISOString()] : []
                );
        }
    }

    /**
     * Get transactions by their IDs and type
     * @param type The transaction type ('ticket', 'invoice', or 'bank') 
     * @param ids The list of transaction IDs
     * @param batchSize Optional batch size for processing (defaults to instance batchSize)
     * @returns List of transactions
     */
    async getTransactionsByIds(type: 'ticket' | 'invoice' | 'bank', ids: string[], batchSize?: number): Promise<(TicketAccountingTransaction | InvoiceAccountingTransaction | BankAccountingTransaction)[]> {
        const processingBatchSize = batchSize || this.batchSize;
        
        switch (type) {
            case 'ticket': {
                const transactions = await this.fetchTransactionsFromIds<TicketAccountingTransactionDto>(
                    ids,
                    (batchIds) => this.actor.getTicketAccountingTransactionByIds(batchIds) as Promise<TicketAccountingTransactionDto[]>,
                    processingBatchSize
                );
                return transactions.map(trx => TicketAccountingTransaction.fromDto(trx));
            }
            case 'invoice': {
                const transactions = await this.fetchTransactionsFromIds<InvoiceAccountingTransactionDTO>(
                    ids,
                    (batchIds) => this.actor.getInvoiceAccountingTransactionByIds(batchIds) as Promise<InvoiceAccountingTransactionDTO[]>,
                    processingBatchSize
                );
                return transactions.map(trx => InvoiceAccountingTransaction.fromDto(trx));
            }
            case 'bank': {
                const transactions = await this.fetchTransactionsFromIds<BankAccountingTransactionDTO>(
                    ids,
                    (batchIds) => this.actor.getBankAccountingTransactionByIds(batchIds) as Promise<BankAccountingTransactionDTO[]>,
                    processingBatchSize
                );
                return transactions.map(trx => BankAccountingTransaction.fromDto(trx));
            }
        }
    }

    private async fetchTransactionsFromIds<T>(ids: string[], fetchFunction: (ids: string[]) => Promise<T[]>, batchSize: number = this.batchSize): Promise<T[]> {
        const transactions: T[] = [];

        for (let i = 0; i < ids.length; i += batchSize) {
            const batchIds = ids.slice(i, i + batchSize);
            const batchTransactions = await fetchFunction(batchIds);
            transactions.push(...batchTransactions);
        }

        return transactions;
    }
}
