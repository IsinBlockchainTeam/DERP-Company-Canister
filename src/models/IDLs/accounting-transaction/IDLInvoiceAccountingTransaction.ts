import { IDL } from "azle";
import { IDLAccountingTransactionAdditionalInformation, IDLAccountingTransactionHeader, IDLAccountingTransactionLineItemTax, IDLAccountingTransactionTotals } from "./IDLAccountingTransaction";

export const IDLInvoiceAddressDTO = IDL.Record({
    StreetOne: IDL.Text,
    StreetTwo: IDL.Opt(IDL.Text),
    PostalCode: IDL.Text,
    CountryCode: IDL.Text,
})

export const IDLInvioceContactDTO = IDL.Record({
    Name: IDL.Text,
    Email: IDL.Text,
    Phone: IDL.Text,
})


export const IDLInvoiceCompanyDTO = IDL.Record({
    ID: IDL.Text,
    Name: IDL.Text,
    Address: IDLInvoiceAddressDTO,
    Contact: IDLInvioceContactDTO,
})

export const IDLInvoiceTaxDTO = IDL.Record({
    Amount: IDL.Float64,
    TypeCode: IDL.Text,
    RateApplicablePercent: IDL.Float64,
})

export const IDLInvoiceLineItemDTO = IDL.Record({
    ItemCode: IDL.Text,
    Description: IDL.Text,
    Quantity: IDL.Float64,
    UnitCode: IDL.Text,
    UnitPrice: IDL.Float64,
    TotalInclTax: IDL.Float64,
    TotalExclTax: IDL.Float64,
    Tax: IDLAccountingTransactionLineItemTax,
})

export const IDLInvoiceStatementItemDTO = IDL.Record({
    StatementItemId: IDL.Int32,
    TotalExclTax: IDL.Float64,
    TotalInclTax: IDL.Float64,
    Tax: IDLInvoiceTaxDTO,
    Description: IDL.Text,
})

export const IDLPaymentPayeeDTO = IDL.Record({
    Name: IDL.Text,
    StreetOne: IDL.Text,
    PostalCode: IDL.Text,
    City: IDL.Text,
    CountryCode: IDL.Text,
})

export const IDLInvoicePaymentDetailsDTO = IDL.Record({
    IBAN: IDL.Text,
    Reference: IDL.Text,
    BicSwift: IDL.Text,
    QR: IDL.Text,
    Bank: IDL.Text,
    Payee: IDLPaymentPayeeDTO,
})

export const IDLInvoiceAttachment = IDL.Record({
    FileName: IDL.Text,
    FileType: IDL.Text,
    DocumentId: IDL.Int32,
})

export const IDLInvoiceAccountingTransaction = IDL.Record({
    Tax: IDL.Vec(IDLInvoiceTaxDTO),
    Seller: IDLInvoiceCompanyDTO,
    Buyer: IDLInvoiceCompanyDTO,
    LineItem: IDL.Vec(IDLInvoiceLineItemDTO),
    InvoiceStatementItem: IDL.Vec(IDLInvoiceStatementItemDTO),
    Payment: IDLInvoicePaymentDetailsDTO,
    Attachments: IDL.Vec(IDLInvoiceAttachment),
    AdditionalInformation: IDLAccountingTransactionAdditionalInformation,
    Header: IDLAccountingTransactionHeader,
    Totals: IDLAccountingTransactionTotals
})
