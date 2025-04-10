import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { StableTreeMapIds } from "./Utils";
import { TicketAccountingTransactionSerializer } from "../serializer/TicketAccountingTransactionSerializer";
import { BaseAccountingTransactionRepository } from "./AccountingTransactionRepository";


export class TicketAccountingTransactionRepository extends BaseAccountingTransactionRepository<TicketAccountingTransaction>{
    private static _instance: TicketAccountingTransactionRepository;
    private constructor() { 
        super(
            StableTreeMapIds.TicketAccountingTransaction,
            StableTreeMapIds.TicketAccountingTransactionDateIndex,
            new TicketAccountingTransactionSerializer()
        )
    }

    static get instance() {
        if (!TicketAccountingTransactionRepository._instance) {
            TicketAccountingTransactionRepository._instance = new TicketAccountingTransactionRepository();
        }
        return TicketAccountingTransactionRepository._instance;
    }
}
