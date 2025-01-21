import { IDL } from "azle";

export const IDLDailyStatementItemPresentable = IDL.Record({
    parentStatementItemId: IDL.Int32,
    date: IDL.Text,
    total: IDL.Float32,
    transactionIds: IDL.Vec(IDL.Text),
});
