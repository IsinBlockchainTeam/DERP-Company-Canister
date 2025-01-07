import {IDL} from "azle";
import {
    IDLAccountingTransactionAdditionalInformation,
    IDLAccountingTransactionHeader,
    IDLAccountingTransactionLineItemTax,
    IDLAccountingTransactionTotals
} from "./IDLAccountingTransaction";


const IDLTicketTax = IDL.Record({
    Id: IDL.Text,
    Amount: IDL.Float32,
    TypeCode: IDL.Text,
    RateApplicablePercent: IDL.Float32,
});

const IDLTicketLineItemGroup = IDL.Record({
    Id: IDL.Text,
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
    id:IDL.Text,
    payerAddress:IDL.Text,
    payeeAddress:IDL.Text,
    paymentCurrencyAmount:IDL.Float32,
    issueDate:IDL.Nat,
    paymentType:IDL.Text,
    paymentCurrency:IDL.Text,
    exchangeRate:IDL.Float32,
    amount:IDL.Float32,
    externalId:IDL.Text,
    externalURL:IDL.Text,
});


export const IDLTicketAccountingTransaction = IDL.Record({
    OperatorId: IDL.Opt(IDL.Text),
    OrderId: IDL.Opt(IDL.Text),
    Tax: IDL.Opt(IDL.Vec(IDLTicketTax)),
    LineItemGroups: IDL.Opt(IDL.Vec(IDLTicketLineItemGroup)),
    LineItem: IDL.Opt(IDL.Vec(IDLTicketLineItem)),
    PaymentDetails: IDL.Opt(IDL.Vec(IDLTicketPaymentDetails)),
    AdditionalInformation: IDL.Opt(IDLAccountingTransactionAdditionalInformation),
    Header: IDLAccountingTransactionHeader,
    Totals: IDLAccountingTransactionTotals,
});