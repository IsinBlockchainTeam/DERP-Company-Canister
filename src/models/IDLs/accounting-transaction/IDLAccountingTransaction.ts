import {IDL} from "azle";

export const IDLCustomDate = IDL.Record({
    year: IDL.Int32,
    month: IDL.Int32,
    day: IDL.Int32,
});

export const IDLAccountingTransactionLineItemTax = IDL.Record({
    Amount: IDL.Float32,
    TypeCode: IDL.Text,
    RateApplicablePercent: IDL.Float32,
});

export const  IDLAccountingTransactionHeader = IDL.Record({
    DLTERPId: IDL.Opt(IDL.Text),
    Source: IDL.Opt(IDL.Text),
    TypeCode: IDL.Text,
    TypeKey: IDL.Opt(IDL.Text),
    ExternalReferenceNumber: IDL.Opt(IDL.Text),
    IssueDate: IDL.Opt(IDLCustomDate),
    ValueDate: IDL.Opt(IDLCustomDate),
    Currency: IDL.Opt(IDL.Text),
    Status: IDL.Opt(IDL.Text),
    AccountingId: IDL.Opt(IDL.Text),
    AccountingDate: IDL.Opt(IDLCustomDate),
    Description: IDL.Opt(IDL.Text),
    TotalAmount: IDL.Opt(IDL.Float32),
});

export const IDLAccountingTransactionTotals = IDL.Record({
    TotalExclTax: IDL.Float32,
    TotalInclTax: IDL.Float32,
    TotalTaxAmount: IDL.Float32,
});

export const IDLAccountingTransactionAdditionalInformation = IDL.Record({
   Notes: IDL.Opt(IDL.Text),
});
