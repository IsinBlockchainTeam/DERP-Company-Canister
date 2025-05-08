import {IDL} from "azle";

export const IDLCustomDate = IDL.Record({
    year: IDL.Int32,
    month: IDL.Int32,
    day: IDL.Int32,
});

export const IDLAccountingTransactionLineItemTax = IDL.Record({
    Amount: IDL.Opt(IDL.Float64),
    TypeCode: IDL.Text,
    RateApplicablePercent: IDL.Float64,
});

export const  IDLAccountingTransactionHeader = IDL.Record({
    DLTERPId: IDL.Opt(IDL.Text),
    Source: IDL.Opt(IDL.Text),
    StoreId: IDL.Int32,
    TypeCode: IDL.Text,
    TypeKey: IDL.Opt(IDL.Text),
    ExternalReferenceNumber: IDL.Opt(IDL.Text),
    IssueDate: IDL.Opt(IDL.Text),
    ValueDate: IDL.Opt(IDL.Text),
    Currency: IDL.Opt(IDL.Text),
    Status: IDL.Opt(IDL.Text),
    AccountingId: IDL.Opt(IDL.Text),
    AccountingDate: IDL.Opt(IDL.Text),
    Description: IDL.Opt(IDL.Text),
    TotalAmount: IDL.Opt(IDL.Float64),
});

export const IDLAccountingTransactionTotals = IDL.Record({
    TotalExclTax: IDL.Float64,
    TotalInclTax: IDL.Float64,
    TotalTaxAmount: IDL.Float64,
});

export const IDLAccountingTransactionAdditionalInformation = IDL.Record({
   Notes: IDL.Opt(IDL.Text),
});
