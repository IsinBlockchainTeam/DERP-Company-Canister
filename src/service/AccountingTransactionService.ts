import {TicketAccountingTransactionRepository} from "../repositories/TicketAccountingTransactionRepository";
import {
    CreateTicketAccountingTransactionDto,
    TicketAccountingTransaction
} from "../models/types/accounting-transaction/TicketAccountingTransaction";


export class AccountingTransactionService{

    private ticketAccountingTransactionRepository = TicketAccountingTransactionRepository.instance;


    storeTicketAccountingTransaction(newTransaction: CreateTicketAccountingTransactionDto): void {
        this.ticketAccountingTransactionRepository.saveTicketAccountingTransaction(TicketAccountingTransaction.fromDto(newTransaction));
    }

    getAllTicketAccountingTransactions(): TicketAccountingTransaction[] {
        return this.ticketAccountingTransactionRepository.getAllTicketAccountingTransactions();
    }

}