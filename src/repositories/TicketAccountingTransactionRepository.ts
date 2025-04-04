import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { StableBTreeMap, stableJson } from "azle";
import { StableTreeMapIds } from "./Utils";
import { TicketAccountingTransactionSerializer } from "../serializer/TicketAccountingTransactionSerializer";


export class TicketAccountingTransactionRepository {
    private static _instance: TicketAccountingTransactionRepository;
    private _ticketTransactions = StableBTreeMap<string, TicketAccountingTransaction>(
        StableTreeMapIds.TicketAccountingTransaction,
        stableJson,
        new TicketAccountingTransactionSerializer()
    );

    private constructor() { }

    static get instance() {
        if (!TicketAccountingTransactionRepository._instance) {
            TicketAccountingTransactionRepository._instance = new TicketAccountingTransactionRepository();
        }
        return TicketAccountingTransactionRepository._instance;
    }

    save(transaction: TicketAccountingTransaction): void {
        this._ticketTransactions.insert(transaction.Header.DLTERPId!, transaction);
    }

    list(dateFrom?: Date, dateTo?: Date): TicketAccountingTransaction[] {
        const res = this._ticketTransactions.values()
        return res.filter(trx => {
            if (dateFrom && trx.Header.IssueDate && trx.Header.IssueDate < dateFrom) return false;
            if (dateTo && trx.Header.IssueDate && trx.Header.IssueDate > dateTo) return false;
            return true;
        });
    }

    get(id: string): TicketAccountingTransaction | null {
        const trx = this._ticketTransactions.get(id);
        if (!trx) return null;

        return trx;
    }
}
