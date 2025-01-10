import {IDL, query, update} from "azle";
import {
    CreateTicketAccountingTransactionDto,
    TicketAccountingTransaction
} from "../models/types/accounting-transaction/TicketAccountingTransaction";
import {AccountingTransactionService} from "../service/AccountingTransactionService";
import {IDLTicketAccountingTransaction} from "../models/IDLs/accounting-transaction/IDLTicketAccountingTransaction";


class AccountingTransactionController {
    @query([], IDL.Vec(IDLTicketAccountingTransaction))
    async getAllTicketAccountingTransactions(): Promise<TicketAccountingTransaction[] | [{}]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        return accountingTransactionService.getAllTicketAccountingTransactions();
    }

    @update([IDLTicketAccountingTransaction])
    storeTicketAccountingTransaction(newTransaction: CreateTicketAccountingTransactionDto): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        accountingTransactionService.storeTicketAccountingTransaction(newTransaction);
    }



}

export default AccountingTransactionController;
