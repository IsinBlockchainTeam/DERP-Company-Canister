import {TicketAccountingTransaction} from "../models/types/accounting-transaction/TicketAccountingTransaction";
import {StableBTreeMap} from "azle";
import {StableTreeMapIds} from "./Utils";


export class TicketAccountingTransactionRepository{
    private static _instance: TicketAccountingTransactionRepository;
    private _ticketTransactions = StableBTreeMap<string, TicketAccountingTransaction>(StableTreeMapIds.TicketAccountingTransaction);

    private constructor() {}
    static get instance() {
        if (!TicketAccountingTransactionRepository._instance) {
            TicketAccountingTransactionRepository._instance = new TicketAccountingTransactionRepository();
        }
        return TicketAccountingTransactionRepository._instance;
    }

    saveTicketAccountingTransaction(ticketAccountingTransaction: TicketAccountingTransaction): void {
        //TODO: check if the ticketAccountingTransaction is valid
        this._ticketTransactions.insert(ticketAccountingTransaction.Header.DLTERPId, ticketAccountingTransaction);
    }

    getAllTicketAccountingTransactions(): TicketAccountingTransaction[] {
        return this._ticketTransactions.values();
    }
}