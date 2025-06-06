import { IDL } from "azle";

export const IDLDailyTransactionRecord = IDL.Record({
    id: IDL.Int32,
    parentStatementItemId: IDL.Int32,
    date: IDL.Text,
    total: IDL.Float64,
    transactionId: IDL.Text,
    txType: IDL.Text,
    originalRuleId: IDL.Opt(IDL.Int32),
}); 