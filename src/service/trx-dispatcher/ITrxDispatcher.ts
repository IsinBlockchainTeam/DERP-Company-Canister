import { AccountingTransaction } from "../../models/types/accounting-transaction/AccountingTransaction";

export interface ITrxDispatcher<T extends AccountingTransaction> {
    dispatch(trx: T): void;
}
