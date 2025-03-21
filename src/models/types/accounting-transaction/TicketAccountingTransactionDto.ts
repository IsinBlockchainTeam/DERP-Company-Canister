import { type AccountingTransactionTaxTypeCode } from "./AccountingTransaction";
import { AccountingTransactionAdditionalInfoDto, AccountingTransactionHeaderDto, AccountingTransactionLineItemTaxDto, AccountingTransactionTotalsDto, AccountingTransactionWithTotalsDto } from "./AccountingTransactionDto";

export class TicketLineItemGroupDto {
    Id: string;
    Description: string;

    constructor(id: string, description: string) {
        this.Id = id;
        this.Description = description;
    }
}

export class TicketTaxDto {
    Id: string;
    Amount: number;
    TypeCode: AccountingTransactionTaxTypeCode;
    RateApplicablePercent: number;

    constructor(id: string, amount: number, typeCode: AccountingTransactionTaxTypeCode, rateApplicablePercent: number) {
        this.Id = id;
        this.Amount = amount;
        this.TypeCode = typeCode;
        this.RateApplicablePercent = rateApplicablePercent;
    }
}

export class TicketLineItemDto {
    ItemGroupId: string;
    ItemCode: string;
    Description: string;
    Quantity: number;
    UnitCode: string;
    UnitPrice: number;
    TotalInclTax: number;
    TotalExclTax: number;
    Tax: AccountingTransactionLineItemTaxDto;

    constructor(
        itemGroupId: string,
        itemCode: string,
        description: string,
        quantity: number,
        unitCode: string,
        unitPrice: number,
        totalInclTax: number,
        totalExclTax: number,
        tax: AccountingTransactionLineItemTaxDto
    ) {
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

export class TicketPaymentDetailsDto {
    id: string;
    payerAddress: [string] | [];
    payeeAddress: [string] | [];
    paymentCurrencyAmount: number;
    issueDate: string;
    paymentType: string;
    paymentCurrency: string;
    exchangeRate: number;
    amount: number;
    externalId: string;

    constructor(
        id: string,
        payerAddress: [string] | [],
        payeeAddress: [string] | [],
        paymentCurrencyAmount: number,
        issueDate: string,
        paymentType: string,
        paymentCurrency: string,
        exchangeRate: number,
        amount: number,
        externalId: string
    ) {
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
    }
}

export class TicketAccountingTransactionDto extends AccountingTransactionWithTotalsDto {
    OperatorId: [string] | [];
    OrderId: [string] | [];
    Tax: [TicketTaxDto[]] | [];
    LineItemGroups: [TicketLineItemGroupDto[]] | [];
    LineItem: [TicketLineItemDto[]] | [];
    PaymentDetails: [TicketPaymentDetailsDto[]] | [];
    AdditionalInformation: [AccountingTransactionAdditionalInfoDto] | [];

    constructor(
        operatorId: [string] | [],
        orderId: [string] | [],
        tax: [TicketTaxDto[]] | [],
        lineItemGroups: [TicketLineItemGroupDto[]] | [],
        lineItem: [TicketLineItemDto[]] | [],
        paymentDetails: [TicketPaymentDetailsDto[]] | [],
        additionalInformation: [AccountingTransactionAdditionalInfoDto] | [],
        header: AccountingTransactionHeaderDto,
        totals: AccountingTransactionTotalsDto
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
}
