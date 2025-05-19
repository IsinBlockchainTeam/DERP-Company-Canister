import { IDL } from "azle";
import {
    IDLAccountingTransactionAdditionalInformation,
    IDLAccountingTransactionHeader,
    IDLAccountingTransactionLineItemTax,
    IDLAccountingTransactionTotals,
} from "./IDLAccountingTransaction";


const IDLTicketTax = IDL.Record({
    Id: IDL.Text,
    Amount: IDL.Float64,
    TypeCode: IDL.Text,
    RateApplicablePercent: IDL.Float64,
});

const IDLTicketLineItemGroup = IDL.Record({
    Id: IDL.Text,
    Description: IDL.Text,
});


const IDLTicketLineItem = IDL.Record({
    ItemGroupId: IDL.Opt(IDL.Text),
    ItemCode: IDL.Text,
    Description: IDL.Text,
    Quantity: IDL.Float64,
    UnitCode: IDL.Text,
    UnitPrice: IDL.Float64,
    TotalInclTax: IDL.Float64,
    TotalExclTax: IDL.Opt(IDL.Float64),
    Tax: IDLAccountingTransactionLineItemTax,
});

const IDLTicketPaymentDetails = IDL.Record({
    id: IDL.Text,
    payerAddress: IDL.Opt(IDL.Text),
    payeeAddress: IDL.Opt(IDL.Text),
    paymentCurrencyAmount: IDL.Float64,
    issueDate: IDL.Text,
    paymentType: IDL.Text,
    paymentTypeId: IDL.Text,
    paymentCurrency: IDL.Text,
    exchangeRate: IDL.Float64,
    amount: IDL.Float64,
    externalId: IDL.Text,
    creditCardDescription: IDL.Opt(IDL.Text),
    creditCardNum: IDL.Opt(IDL.Text),
    creditCardAuthorizationDate: IDL.Opt(IDL.Text),
    creditCardAuthorizationNum: IDL.Opt(IDL.Text),
    creditCardTerminalCode: IDL.Opt(IDL.Text),
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
