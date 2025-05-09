import { AccountingTransaction, AccountingTransactionType } from "../../models/types/accounting-transaction/AccountingTransaction";
import { ITrxDispatcher } from './ITrxDispatcher';
import { TicketDispatcher } from "./TicketDispatcher";
import { BankDispatcher } from "./BankDispatcher";

export class TrxDispatcher {
    private static _instance: TrxDispatcher;

    private static _dispatchMap: { [key in AccountingTransactionType]: ITrxDispatcher<AccountingTransaction> | null } = {
        [AccountingTransactionType.TICKET]: new TicketDispatcher(),
        [AccountingTransactionType.BANK_TRX]: new BankDispatcher(),
        [AccountingTransactionType.INVOICE]: null,
    };

    private constructor() { }
    static get instance() {
        if (!TrxDispatcher._instance) {
            TrxDispatcher._instance = new TrxDispatcher();
        }
        return TrxDispatcher._instance;
    }

    public dispatch(trx: AccountingTransaction): void {
        const dispatcher = TrxDispatcher._dispatchMap[trx.Header.TypeCode];
        if (!dispatcher) {
            throw new Error(`No dispatcher for transaction type ${trx.Header.TypeCode}`);
        }
         
        dispatcher.dispatch(trx);
    }
}
