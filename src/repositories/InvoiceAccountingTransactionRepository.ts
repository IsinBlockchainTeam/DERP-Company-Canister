import { InvoiceAccountingTransaction } from "../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { InvoiceAccountingTransactionSerializer } from "../serializer/InvoiceAccountingTransactionSerializer";
import { BaseAccountingTransactionRepository } from "./AccountingTransactionRepository";
import { StableTreeMapIds } from "./Utils";

export class InvoiceAccountingTransactionRepository extends BaseAccountingTransactionRepository<InvoiceAccountingTransaction> {
    private static _instance: InvoiceAccountingTransactionRepository;

    private constructor() { 
        super(
            StableTreeMapIds.InvoiceAccountingTransaction,
            StableTreeMapIds.InvoiceAccountingTransactionDateIndex,
            new InvoiceAccountingTransactionSerializer()
        )
    }

    static get instance() {
        if (!InvoiceAccountingTransactionRepository._instance) {
            InvoiceAccountingTransactionRepository._instance = new InvoiceAccountingTransactionRepository();
        }
        return InvoiceAccountingTransactionRepository._instance;
    }
}
