import {IDL} from "azle";
import {
    IDLAccountingTransactionHeader,
    IDLAccountingTransactionLineItemTax,
    IDLAccountingTransactionTotals
} from "./IDLAccountingTransaction";


const IDLTicketTax = IDL.Record({
    TaxId: IDL.Text,
    TaxAmount: IDL.Float32,
    TypeCode: IDL.Text,
    RateApplicablePercent: IDL.Float32,
});

const IDLTicketLineItemGroup = IDL.Record({
    GroupId: IDL.Text,
    Description: IDL.Text,
});


const IDLTicketLineItem = IDL.Record({
    ItemGroupId: IDL.Text,
    ItemCode: IDL.Text,
    Description: IDL.Text,
    Quantity: IDL.Float32,
    UnitCode: IDL.Text,
    UnitPrice: IDL.Float32,
    TotalInclTax: IDL.Float32,
    TotalExclTax: IDL.Float32,
    Tax: IDLAccountingTransactionLineItemTax,
});

const IDLTicketPaymentDetails = IDL.Record({
    PaymentID:IDL.Text,
    PayerAddress:IDL.Text,
    PayeeAddress:IDL.Text,
    PaymentCurrencyAmount:IDL.Float32,
    IssueDate:IDL.Nat,
    PaymentType:IDL.Text,
    PaymentCurrency:IDL.Text,
    ExchangeRate:IDL.Float32,
    Amount:IDL.Float32,
    ExternalId:IDL.Text,
    DocumentURL:IDL.Text,
});


export const IDLTicketAccountingTransaction = IDL.Record({
    OperatorId: IDL.Opt(IDL.Text),
    OrderId: IDL.Opt(IDL.Text),
    Tax: IDL.Opt(IDL.Vec(IDLTicketTax)),
    LineItemGroups: IDL.Opt(IDL.Vec(IDLTicketLineItemGroup)),
    LineItem: IDL.Opt(IDL.Vec(IDLTicketLineItem)),
    PaymentDetails: IDL.Opt(IDL.Vec(IDLTicketPaymentDetails)),
    AdditionalInformation: IDL.Opt(IDL.Text),
    Header: IDLAccountingTransactionHeader,
    Totals: IDLAccountingTransactionTotals,
});