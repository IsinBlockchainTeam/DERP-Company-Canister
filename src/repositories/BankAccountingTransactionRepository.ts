import { StableBTreeMap, stableJson } from "azle";
import { StableTreeMapIds } from "./Utils";
import { BankAccountingTransaction, BankTransactionAddress } from "../models/types/accounting-transaction/BankAccountingTransaction";
import { BankAccountingTransactionSerializer } from "../serializer/BankAccountingTransactionSerializer";

export class BankAccountingTransactionRepository {
    private static _instance: BankAccountingTransactionRepository;
    private _ticketTransactions = StableBTreeMap<string, BankAccountingTransaction>(
        StableTreeMapIds.BankAccountingTransaction,
        stableJson,
        new BankAccountingTransactionSerializer()
    );

    private constructor() { }

    static get instance() {
        if (!BankAccountingTransactionRepository._instance) {
            BankAccountingTransactionRepository._instance = new BankAccountingTransactionRepository();
        }
        return BankAccountingTransactionRepository._instance;
    }

    save(transaction: BankAccountingTransaction): void {
        this._ticketTransactions.insert(transaction.Header.DLTERPId!, transaction);
    }

    list(dateFrom?: Date, dateTo?: Date): BankAccountingTransaction[] {
        const res = this._ticketTransactions.values()
        return res.filter(trx => {
            if (dateFrom && trx.Header.IssueDate && trx.Header.IssueDate < dateFrom) return false;
            if (dateTo && trx.Header.IssueDate && trx.Header.IssueDate > dateTo) return false;
            return true;
        });
    }

    get(id: string): BankAccountingTransaction | null {
        const trx = this._ticketTransactions.get(id);
        if (!trx) return null;

        return trx;
    }
}
