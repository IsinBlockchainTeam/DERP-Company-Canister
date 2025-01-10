import { IDL } from "azle";

export const IDLMonthlyStatementItemPresentable = IDL.Record({
    parentStatementItemId: IDL.Int32,
    monthIndex: IDL.Int32,
    total: IDL.Nat32,
});
