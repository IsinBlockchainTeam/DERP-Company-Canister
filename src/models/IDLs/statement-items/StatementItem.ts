import { IDL } from "azle";
import { IDLCustomDate } from "../accounting-transaction/IDLAccountingTransaction";

export const IDLStatementItemDto = IDL.Record({
    id: IDL.Int32,
    name: IDL.Text,
    currency: IDL.Text,
    category: IDL.Int32,
});

export const IDLStatementItem = IDL.Record({
    id: IDL.Int32,
    name: IDL.Text,
    currency: IDL.Text,
    category: IDL.Int32,
});

export const IDLStatementItemAggregate = IDL.Record({
    parentStatementItemId: IDL.Int32,
    total: IDL.Float32,
    year: IDL.Nat32,
    month: IDL.Opt(IDL.Nat32),
    day: IDL.Opt(IDL.Nat32),
});
