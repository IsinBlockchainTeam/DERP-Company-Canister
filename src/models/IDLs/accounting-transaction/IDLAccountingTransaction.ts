import {IDL} from "azle";


export const IDLAccountingTransactionLineItemTax = IDL.Record({
    Amount: IDL.Float32,
    TypeCode: IDL.Text,
    RateApplicablePercent: IDL.Float32,
});

export const IDLAccountingTransactionHeader = IDL.Record({
    DLTERPId: IDL.Text,
    Source: IDL.Opt(IDL.Text),
    TypeCode: IDL.Opt(IDL.Text),
    TypeKey: IDL.Opt(IDL.Text),
    ExternalReferenceNumber: IDL.Opt(IDL.Text),
    IssueDate: IDL.Opt(IDL.Nat),
    ValueDate: IDL.Opt(IDL.Nat),
    Currency: IDL.Opt(IDL.Text),
    Status: IDL.Opt(IDL.Text),
    AccountingId: IDL.Opt(IDL.Text),
    AccountingDate: IDL.Opt(IDL.Nat),
    Description: IDL.Opt(IDL.Text),
});

export const IDLAccountingTransactionTotals = IDL.Record({
    TotalExclTax: IDL.Float32,
    TotalInclTax: IDL.Float32,
    TotalTaxAmount: IDL.Float32,
});
