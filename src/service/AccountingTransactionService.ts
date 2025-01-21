import {TicketAccountingTransactionRepository} from "../repositories/TicketAccountingTransactionRepository";
import {
    TicketAccountingTransaction
} from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { DispatchRuleService } from "./DispatchRulesService";
import { CreateTicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";


export class AccountingTransactionService {
    private ticketAccountingTransactionRepository = TicketAccountingTransactionRepository.instance;


    storeTicketAccountingTransaction(newTransaction: CreateTicketAccountingTransactionDto): void {
        console.log(newTransaction);
        const trx = TicketAccountingTransaction.fromDto(newTransaction);
        this.ticketAccountingTransactionRepository.saveTicketAccountingTransaction(trx);

        const dispatchRuleService = new DispatchRuleService();
        dispatchRuleService.dispatch(trx);
    }

    getAllTicketAccountingTransactions(): TicketAccountingTransaction[] {
        return this.ticketAccountingTransactionRepository.getAllTicketAccountingTransactions();
    }

    getTicketAccountingTransactionById(id: string): TicketAccountingTransaction | null {
        return this.ticketAccountingTransactionRepository.getTicketAccountingTransactionById(id);
    }
}
