import {TicketAccountingTransactionRepository} from "../repositories/TicketAccountingTransactionRepository";
import {
    TicketAccountingTransaction
} from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { DispatchRuleService } from "./DispatchRulesService";
import { InvoiceAccountingTransactionRepository } from "../repositories/InvoiceAccountingTransactionRepository";
import { BankAccountingTransactionRepository } from "../repositories/BankAccountingTransactionRepository";
import { InvoiceAccountingTransaction } from "../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { BankAccountingTransaction } from "../models/types/accounting-transaction/BankAccountingTransaction";


export class AccountingTransactionService {
    private ticketAccountingTransactionRepository = TicketAccountingTransactionRepository.instance;
    private invoiceAccountingTransactionRepository = InvoiceAccountingTransactionRepository.instance;
    private bankAccountingTransactionRepository = BankAccountingTransactionRepository.instance;

    storeTicketAccountingTransaction(newTransaction: TicketAccountingTransaction): void {
        this.ticketAccountingTransactionRepository.save(newTransaction);

        const dispatchRuleService = new DispatchRuleService();
        dispatchRuleService.dispatch(newTransaction);
    }

    storeInvoiceAccountingTransaction(newTransaction: InvoiceAccountingTransaction): void {
        this.invoiceAccountingTransactionRepository.save(newTransaction);
    }

    storeBankAccountingTransaction(newTransaction: BankAccountingTransaction): void {
        this.bankAccountingTransactionRepository.save(newTransaction);
    }

    getAllTicketAccountingTransactions(dateFrom?: Date, dateTo?: Date): string[] {
        return this.ticketAccountingTransactionRepository.list(dateFrom, dateTo);
    }

    getAllInvoiceAccountingTransactions(dateFrom?: Date, dateTo?: Date): string[] {
        return this.invoiceAccountingTransactionRepository.list(dateFrom, dateTo);
    }

    getAllBankAccountingTransactions(dateFrom?: Date, dateTo?: Date): string[] {
        return this.bankAccountingTransactionRepository.list(dateFrom, dateTo);
    }

    getTicketAccountingTransactionById(id: string): TicketAccountingTransaction | null {
        return this.ticketAccountingTransactionRepository.get(id);
    }

    getInvoiceAccountingTransactionById(id: string): InvoiceAccountingTransaction | null {
        return this.invoiceAccountingTransactionRepository.get(id);
    }

    getBankAccountingTransactionById(id: string): BankAccountingTransaction | null {
        return this.bankAccountingTransactionRepository.get(id);
    }

    getActualDate(date: [string] | []): Date | undefined {
        return date.length > 0 && date[0] ? new Date(date[0]) : undefined;
    }
}
