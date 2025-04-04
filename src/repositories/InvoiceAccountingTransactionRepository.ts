import { StableBTreeMap, stableJson } from "azle";
import { StableTreeMapIds } from "./Utils";
import { InvoiceAccountingTransaction } from "../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { InvoiceAccountingTransactionSerializer } from "../serializer/InvoiceAccountingTransactionSerializer";


export class InvoiceAccountingTransactionRepository {
    private static _instance: InvoiceAccountingTransactionRepository;
    private _ticketTransactions = StableBTreeMap<string, InvoiceAccountingTransaction>(
        StableTreeMapIds.InvoiceAccountingTransaction,
        stableJson,
        new InvoiceAccountingTransactionSerializer()
    );

    private constructor() { }

    static get instance() {
        if (!InvoiceAccountingTransactionRepository._instance) {
            InvoiceAccountingTransactionRepository._instance = new InvoiceAccountingTransactionRepository();
        }
        return InvoiceAccountingTransactionRepository._instance;
    }

    save(transaction: InvoiceAccountingTransaction): void {
        this._ticketTransactions.insert(transaction.Header.DLTERPId!, transaction);
    }

    list(dateFrom?: Date, dateTo?: Date): InvoiceAccountingTransaction[] {
        const res = this._ticketTransactions.values()
        return res.filter(trx => {
            if (dateFrom && trx.Header.IssueDate && trx.Header.IssueDate < dateFrom) return false;
            if (dateTo && trx.Header.IssueDate && trx.Header.IssueDate > dateTo) return false;
            return true;
        });
    }

    get(id: string): InvoiceAccountingTransaction | null {
        const trx = this._ticketTransactions.get(id);
        if (!trx) return null;

        return trx;
    }
}
