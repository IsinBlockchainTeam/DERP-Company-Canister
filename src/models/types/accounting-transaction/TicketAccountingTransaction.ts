

// Represent a product group in the ticket
import {
    AccountingTransactionAdditionalInfo, AccountingTransactionHeader,
    AccountingTransactionLineItemTax,
    AccountingTransactionTaxTypeCode, AccountingTransactionTotals,
    AccountingTransactionWithTotals
} from "./AccountingTransaction";

export class TicketLineItemGroup {
    // ID of the product group
    Id: string;

    // Description of the product group
    Description: string;

    constructor(id: string, description: string) {
        this.Id = id;
        this.Description = description
    }
}

export class TicketTax {
    // ID of the tax
    Id: string;

    // Total tax amount over the line item
    Amount: number;

    // Type of the tax e.g. VAT
    TypeCode: AccountingTransactionTaxTypeCode;

    // Tax rate in percent 0-100
    RateApplicablePercent: number;

    constructor(id: string, amount: number, typeCode: AccountingTransactionTaxTypeCode, rateApplicablePercent: number) {
        this.Id = id;
        this.Amount = amount;
        this.TypeCode = typeCode;
        this.RateApplicablePercent = rateApplicablePercent;
    }
}

export class TicketLineItem {
    // ID of the product group
    ItemGroupId: string;

    // ID of the product in the Seller system
    ItemCode: string;

    // Description of the product
    Description: string;

    // Quantity of the product
    Quantity: number;

    // Measure unit of the product
    UnitCode: string;

    // Unit price of the product
    UnitPrice: number;

    // Total price of the product including tax
    TotalInclTax: number;

    // Total price of the product excluding tax
    TotalExclTax: number;

    // Tax applied to the product
    Tax: AccountingTransactionLineItemTax;

    constructor(itemGroupId: string, itemCode: string, description: string, quantity: number, unitCode: string, unitPrice: number, totalInclTax: number, totalExclTax: number, tax: AccountingTransactionLineItemTax) {
        this.ItemGroupId = itemGroupId;
        this.ItemCode = itemCode;
        this.Description = description;
        this.Quantity = quantity;
        this.UnitCode = unitCode;
        this.UnitPrice = unitPrice;
        this.TotalInclTax = totalInclTax;
        this.TotalExclTax = totalExclTax;
        this.Tax = tax;
    }
}

export class TicketPaymentDetails {
    id: string;
    payerAddress: string;
    payeeAddress: string;
    paymentCurrencyAmount: number;
    issueDate: Date;
    paymentType: string;
    paymentCurrency: string;

    // Exchange rate of the payment currency to the ticket currency
    exchangeRate: number;

    // Amount paid in the ticket currency
    amount: number;

    // ID of the transaction in the payment system e.g. datatrans ID
    externalId: string;

    // URL to the payment receipt PDF
    externalUrl: string;

    constructor(id: string, payerAddress: string, payeeAddress: string, paymentCurrencyAmount: number, issueDate: Date, paymentType: string, paymentCurrency: string, exchangeRate: number, amount: number, externalId: string, externalUrl: string) {
        this.id = id;
        this.payerAddress = payerAddress;
        this.payeeAddress = payeeAddress;
        this.paymentCurrencyAmount = paymentCurrencyAmount;
        this.issueDate = issueDate;
        this.paymentType = paymentType;
        this.paymentCurrency = paymentCurrency;
        this.exchangeRate = exchangeRate;
        this.amount = amount;
        this.externalId = externalId;
        this.externalUrl = externalUrl;
    }
}

export class TicketAccountingTransaction extends AccountingTransactionWithTotals {
    // ID of the operator that created the transaction
    OperatorId: string | null;

    // ID of the order regarding the transaction
    OrderId: string | null;

    // List of taxes paid in the transaction
    Tax: TicketTax[] | null;

    // List of product groups in the transaction
    LineItemGroups: TicketLineItemGroup[] | null;

    // List of products in the transaction
    LineItem: TicketLineItem[] | null;

    PaymentDetails: TicketPaymentDetails[] | null;

    AdditionalInformation: AccountingTransactionAdditionalInfo | null;

    constructor(operatorId: string | null,
                orderId: string | null,
                tax: TicketTax[] | null,
                lineItemGroups: TicketLineItemGroup[] | null,
                lineItem: TicketLineItem[] | null,
                paymentDetails: TicketPaymentDetails[] | null,
                additionalInformation: AccountingTransactionAdditionalInfo | null,
                header: AccountingTransactionHeader,
                totals: AccountingTransactionTotals
    ) {
        super(header, totals);
        this.OperatorId = operatorId;
        this.OrderId = orderId;
        this.Tax = tax;
        this.LineItemGroups = lineItemGroups;
        this.LineItem = lineItem;
        this.PaymentDetails = paymentDetails;
        this.AdditionalInformation = additionalInformation;
    }

    static fromDto(dto: CreateTicketAccountingTransactionDto): TicketAccountingTransaction {
        return new TicketAccountingTransaction(
            dto.OperatorId,
            dto.OrderId,
            dto.Tax,
            dto.LineItemGroups,
            dto.LineItem,
            dto.PaymentDetails,
            dto.AdditionalInformation,
            dto.Header,
            dto.Totals
        );
    }
}

export type CreateTicketAccountingTransactionDto = {
    OperatorId: string | null;
    OrderId: string | null;
    Tax: TicketTax[] | null;
    LineItemGroups: TicketLineItemGroup[] | null;
    LineItem: TicketLineItem[] | null;
    PaymentDetails: TicketPaymentDetails[] | null;
    AdditionalInformation: AccountingTransactionAdditionalInfo | null;
    Header: AccountingTransactionHeader;
    Totals: AccountingTransactionTotals;
}
