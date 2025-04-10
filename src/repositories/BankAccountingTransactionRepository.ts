import { BankAccountingTransaction } from "../models/types/accounting-transaction/BankAccountingTransaction";
import { BankAccountingTransactionSerializer } from "../serializer/BankAccountingTransactionSerializer";
import { BaseAccountingTransactionRepository } from "./AccountingTransactionRepository";
import { StableTreeMapIds } from "./Utils";

export class BankAccountingTransactionRepository extends BaseAccountingTransactionRepository<BankAccountingTransaction> {
    private static _instance: BankAccountingTransactionRepository;

    private constructor() {
        super(
            StableTreeMapIds.BankAccountingTransaction,
            StableTreeMapIds.BankAccountingTransactionDateIndex,
            new BankAccountingTransactionSerializer()
        );
    }

    static get instance() {
        if (!BankAccountingTransactionRepository._instance) {
            BankAccountingTransactionRepository._instance = new BankAccountingTransactionRepository();
        }
        return BankAccountingTransactionRepository._instance;
    }
}
