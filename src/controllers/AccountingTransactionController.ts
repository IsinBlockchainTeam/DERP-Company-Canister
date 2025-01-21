import { IDL, query, update } from "azle";
import { IDLTicketAccountingTransaction } from "../models/IDLs/accounting-transaction/IDLTicketAccountingTransaction";
import { CreateTicketAccountingTransactionDto, TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { AccountingTransactionService } from "../service/AccountingTransactionService";


class AccountingTransactionController {
    @query([], IDL.Vec(IDLTicketAccountingTransaction))
    async getAllTicketAccountingTransactions(): Promise<TicketAccountingTransactionDto[] | [{}]> {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        return accountingTransactionService.getAllTicketAccountingTransactions().map(trx => trx.toDto());
    }

    @update([IDLTicketAccountingTransaction])
    storeTicketAccountingTransaction(newTransaction: CreateTicketAccountingTransactionDto): void {
        const accountingTransactionService: AccountingTransactionService = new AccountingTransactionService();
        console.log("sono nel controller ", newTransaction);
        accountingTransactionService.storeTicketAccountingTransaction(newTransaction);
    }
}

export default AccountingTransactionController;
