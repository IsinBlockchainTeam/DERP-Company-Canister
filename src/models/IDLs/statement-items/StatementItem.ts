import { IDL } from "azle";

export const IDLStatementItemPresentable = IDL.Record({
    id: IDL.Int32,
    name: IDL.Text,
    currency: IDL.Text,
    category: IDL.Int32,
    total: IDL.Nat32,
    year: IDL.Nat32,
});

export const IDLStatementItem = IDL.Record({
    id: IDL.Int32,
    name: IDL.Text,
    currency: IDL.Text,
    category: IDL.Int32,
    year: IDL.Int32,
});
