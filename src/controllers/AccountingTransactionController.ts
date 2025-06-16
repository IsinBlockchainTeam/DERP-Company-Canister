import { IDL, query, update } from "azle";
import { IDLTicketAccountingTransaction } from "../models/IDLs/accounting-transaction/IDLTicketAccountingTransaction";
import { TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { AccountingTransactionService } from "../service/AccountingTransactionService";
import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { IDLInvoiceAccountingTransaction } from "../models/IDLs/accounting-transaction/IDLInvoiceAccountingTransaction";
import { IDLBankAccountingTransaction } from "../models/IDLs/accounting-transaction/IDLBankAccountingTransaction";
import { InvoiceAccountingTransaction } from "../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { InvoiceAccountingTransactionDTO as InvoiceAccountingTransactionDto } from "../models/types/accounting-transaction/InvoiceAccountingTransactionDto";
import { BankAccountingTransaction } from "../models/types/accounting-transaction/BankAccountingTransaction";
import { BankAccountingTransactionDTO as BankAccountingTransactionDto } from "../models/types/accounting-transaction/BankAccountingTransactionDto";
import { isDefined } from "../models/types/common";


class AccountingTransactionController {
    @query([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], IDL.Vec(IDL.Text))
    async getAllTicketAccountingTransactions(dateFrom: [string] | [], dateTo: [string] | []): Promise<string[]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();

        const actualDateFrom = accountingTransactionService.getActualDate(dateFrom);
        const actualDateTo = accountingTransactionService.getActualDate(dateTo);

        const resp = accountingTransactionService.getAllTicketAccountingTransactions(
            actualDateFrom,
            actualDateTo
        );
        
        return resp;
    }

    @query([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], IDL.Vec(IDL.Text))
    async getAllInvoiceAccountingTransactions(dateFrom: [string] | [], dateTo: [string] | []): Promise<string[]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();

        const actualDateFrom = accountingTransactionService.getActualDate(dateFrom);
        const actualDateTo = accountingTransactionService.getActualDate(dateTo);
        const resp = accountingTransactionService.getAllInvoiceAccountingTransactions(
            actualDateFrom,
            actualDateTo
        );

        return resp;
    }

    @query([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], IDL.Vec(IDL.Text))
    async getAllBankAccountingTransactions(dateFrom: [string] | [], dateTo: [string] | []): Promise<string[]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();

        const actualDateFrom = accountingTransactionService.getActualDate(dateFrom);
        const actualDateTo = accountingTransactionService.getActualDate(dateTo);

        const resp = accountingTransactionService.getAllBankAccountingTransactions(
            actualDateFrom,
            actualDateTo
        );
        
        return resp;
    }
    
    @query([IDL.Vec(IDL.Text)], IDL.Vec(IDLTicketAccountingTransaction))
    async getTicketAccountingTransactionByIds(ids: string[]): Promise<TicketAccountingTransactionDto[]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        const transactions = ids.map(id => accountingTransactionService.getTicketAccountingTransactionById(id));

        return transactions.filter(isDefined).map(trx => trx.toDto());
    }
    
    @query([IDL.Vec(IDL.Text)], IDL.Vec(IDLInvoiceAccountingTransaction))
    async getInvoiceAccountingTransactionByIds(ids: string[]): Promise<InvoiceAccountingTransactionDto[]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        const transactions = ids.map(id => accountingTransactionService.getInvoiceAccountingTransactionById(id));

        return transactions.filter(isDefined).map(trx => trx.toDto());
    }

    @query([IDL.Vec(IDL.Text)], IDL.Vec(IDLBankAccountingTransaction))
    async getBankAccountingTransactionByIds(ids: string[]): Promise<BankAccountingTransactionDto[]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        const transactions = ids.map(id => accountingTransactionService.getBankAccountingTransactionById(id));

        return transactions.filter(isDefined).map(trx => trx.toDto());
    }
    
    @query([IDL.Text], IDLTicketAccountingTransaction)
    async getTicketAccountingTransactionById(id: string): Promise<TicketAccountingTransactionDto> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        const trx = accountingTransactionService.getTicketAccountingTransactionById(id);

        if (!trx) {
            throw new Error(`Ticket accounting transaction with id ${id} not found`);
        }

        return trx.toDto();
    }
    
    @query([IDL.Text], IDLInvoiceAccountingTransaction)
    async getInvoiceAccountingTransactionById(id: string): Promise<InvoiceAccountingTransactionDto> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        const trx = accountingTransactionService.getInvoiceAccountingTransactionById(id);

        if (!trx) {
            throw new Error(`Invoice accounting transaction with id ${id} not found`);
        }

        return trx.toDto();
    }
    
    @query([IDL.Text], IDLBankAccountingTransaction)
    async getBankAccountingTransactionById(id: string): Promise<BankAccountingTransactionDto> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        const trx = accountingTransactionService.getBankAccountingTransactionById(id);

        if (!trx) {
            throw new Error(`Bank accounting transaction with id ${id} not found`);
        }

        return trx.toDto();
    }

    @update([IDLTicketAccountingTransaction])
    storeTicketAccountingTransaction(newTransaction: TicketAccountingTransactionDto): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        accountingTransactionService.storeTicketAccountingTransaction(
            TicketAccountingTransaction.fromDto(newTransaction)
        );
    }

    @update([IDLInvoiceAccountingTransaction])
    storeInvoiceAccountingTransaction(newTransaction: InvoiceAccountingTransactionDto): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        accountingTransactionService.storeInvoiceAccountingTransaction(
            InvoiceAccountingTransaction.fromDto(newTransaction)
        );
    }

    @update([IDLBankAccountingTransaction])
    storeBankAccountingTransaction(newTransaction: BankAccountingTransactionDto): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        accountingTransactionService.storeBankAccountingTransaction(
            BankAccountingTransaction.fromDto(newTransaction)
        );
    }

    @update([IDL.Vec(IDLTicketAccountingTransaction)])
    storeTicketAccountingTransactions(newTransactions: TicketAccountingTransactionDto[]): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        newTransactions.map(newTransaction => accountingTransactionService.storeTicketAccountingTransaction(
            TicketAccountingTransaction.fromDto(newTransaction)
        ));
    }

    @update([IDL.Vec(IDLInvoiceAccountingTransaction)])
    storeInvoiceAccountingTransactions(newTransactions: InvoiceAccountingTransactionDto[]): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        newTransactions.map(newTransaction => accountingTransactionService.storeInvoiceAccountingTransaction(
            InvoiceAccountingTransaction.fromDto(newTransaction)
        ));
    }

    @update([IDL.Vec(IDLBankAccountingTransaction)])
    storeBankAccountingTransactions(newTransactions: BankAccountingTransactionDto[]): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        newTransactions.map(newTransaction => accountingTransactionService.storeBankAccountingTransaction(
            BankAccountingTransaction.fromDto(newTransaction)
        ));
    }
}

export default AccountingTransactionController;
