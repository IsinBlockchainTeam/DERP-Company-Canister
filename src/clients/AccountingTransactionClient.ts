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
        const ids = await this.actor.getAllTicketAccountingTransactions(
            dateFrom ? [dateFrom.toISOString()] : [],
            dateTo ? [dateTo.toISOString()] : [],
        );

        const transactions = await this.fetchTransactionsFromIds<TicketAccountingTransactionDto>(ids,
            (ids) => this.actor.getTicketAccountingTransactionByIds(ids) as Promise<TicketAccountingTransactionDto[]>);

        return transactions.map(trx => TicketAccountingTransaction.fromDto(trx as TicketAccountingTransactionDto));
    }

    async listInvoiceTransactions(dateFrom?: Date, dateTo?: Date) {
        const ids = await this.actor.getAllInvoiceAccountingTransactions(
            dateFrom ? [dateFrom.toISOString()] : [],
            dateTo ? [dateTo.toISOString()] : [],
        );

        const transactions = await this.fetchTransactionsFromIds<InvoiceAccountingTransactionDTO>(ids,
            (ids) => this.actor.getInvoiceAccountingTransactionByIds(ids) as Promise<InvoiceAccountingTransactionDTO[]>);
        
        return transactions.map(trx => InvoiceAccountingTransaction.fromDto(trx as InvoiceAccountingTransactionDTO));
    }

    async listBankTransactions(dateFrom?: Date, dateTo?: Date) {
        const ids = await this.actor.getAllBankAccountingTransactions(
            dateFrom ? [dateFrom.toISOString()] : [],
            dateTo ? [dateTo.toISOString()] : [],
        );

        const transactions = await this.fetchTransactionsFromIds<BankAccountingTransactionDTO>(ids,
            (ids) => this.actor.getBankAccountingTransactionByIds(ids) as Promise<BankAccountingTransactionDTO[]>);
        
        return transactions.map(trx => BankAccountingTransaction.fromDto(trx as BankAccountingTransactionDTO));
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

    private async fetchTransactionsFromIds<T>(ids: string[], fetchFunction: (ids: string[]) => Promise<T[]>): Promise<T[]> {
        const transactions: T[] = [];

        for (let i = 0; i < ids.length; i += this.batchSize) {
            const batchIds = ids.slice(i, i + this.batchSize);
            const batchTransactions = await fetchFunction(batchIds);
            transactions.push(...batchTransactions);
        }

        return transactions;
    }
}
