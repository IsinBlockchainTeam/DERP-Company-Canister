// Represent a product group in the ticket
import {
    AccountingTransactionAdditionalInfo, 
    AccountingTransactionHeader, 
    AccountingTransactionLineItemTax,
    AccountingTransactionTaxTypeCode, AccountingTransactionTotals,
    AccountingTransactionWithTotals,
    CustomDate
} from "./AccountingTransaction";
import { CreateTicketAccountingTransactionDto, TicketAccountingTransactionDto, TicketLineItemDto, TicketLineItemGroupDto, TicketPaymentDetailsDto, TicketTaxDto } from "./TicketAccountingTransactionDto";

export class TicketLineItemGroup {
    // ID of the product group
    Id: string;

    // Description of the product group
    Description: string;

    constructor(id: string, description: string) {
        this.Id = id;
        this.Description = description
    }

    toDto(): TicketLineItemGroupDto {
        return new TicketLineItemGroupDto(this.Id, this.Description);
    }

    static fromDto(dto: TicketLineItemGroupDto): TicketLineItemGroup {
        return new TicketLineItemGroup(dto.Id, dto.Description);
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

    toDto(): TicketTaxDto {
        return new TicketTaxDto(this.Id, this.Amount, this.TypeCode, this.RateApplicablePercent);
    }

    static fromDto(dto: TicketTaxDto): TicketTax {
        return new TicketTax(dto.Id, dto.Amount, dto.TypeCode, dto.RateApplicablePercent);
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

    toDto(): TicketLineItemDto {
        return new TicketLineItemDto(this.ItemGroupId, this.ItemCode, this.Description, this.Quantity, this.UnitCode, this.UnitPrice, this.TotalInclTax, this.TotalExclTax, this.Tax.toDto());
    }

    static fromDto(dto: TicketLineItemDto): TicketLineItem {
        return new TicketLineItem(dto.ItemGroupId, dto.ItemCode, dto.Description, dto.Quantity, dto.UnitCode, dto.UnitPrice, dto.TotalInclTax, dto.TotalExclTax, AccountingTransactionLineItemTax.fromDto(dto.Tax));
    }
}

export class TicketPaymentDetails {
    id: string;
    payerAddress: string;
    payeeAddress: string;
    paymentCurrencyAmount: number;
    issueDate: CustomDate;
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

    constructor(id: string, payerAddress: string, payeeAddress: string, paymentCurrencyAmount: number, issueDate: CustomDate, paymentType: string, paymentCurrency: string, exchangeRate: number, amount: number, externalId: string, externalUrl: string) {
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

    toDto(): TicketPaymentDetailsDto {
        return new TicketPaymentDetailsDto(this.id, this.payerAddress, this.payeeAddress, this.paymentCurrencyAmount, this.issueDate, this.paymentType, this.paymentCurrency, this.exchangeRate, this.amount, this.externalId, this.externalUrl);
    }

    static fromDto(dto: TicketPaymentDetailsDto): TicketPaymentDetails {
        return new TicketPaymentDetails(dto.id, dto.payerAddress, dto.payeeAddress, dto.paymentCurrencyAmount, dto.issueDate, dto.paymentType, dto.paymentCurrency, dto.exchangeRate, dto.amount, dto.externalId, dto.externalURL);
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

    toDto(): TicketAccountingTransactionDto {
        return new TicketAccountingTransactionDto(
            this.OperatorId ? [this.OperatorId] : [],
            this.OrderId ? [this.OrderId] : [],
            this.Tax ? [this.Tax.map(t => t.toDto())] : [],
            this.LineItemGroups ? [this.LineItemGroups.map(g => g.toDto())] : [],
            this.LineItem ? [this.LineItem.map(i => i.toDto())] : [],
            this.PaymentDetails ? [this.PaymentDetails.map(p => p.toDto())] : [],
            this.AdditionalInformation ? [this.AdditionalInformation.toDto()] : [],
            this.Header.toDto(),
            this.Totals.toDto()
        );
    }

    static fromDto(dto: TicketAccountingTransactionDto): TicketAccountingTransaction {
        return new TicketAccountingTransaction(
            dto.OperatorId?.length > 0 ? dto.OperatorId[0] ?? null : null,
            dto.OrderId?.length > 0 ? dto.OrderId[0] ?? null : null,
            dto.Tax?.length > 0 ? dto.Tax[0]!.map(t => TicketTax.fromDto(t)) : null,
            dto.LineItemGroups?.length > 0 ? dto.LineItemGroups[0]!.map(g => TicketLineItemGroup.fromDto(g)) : null,
            dto.LineItem?.length > 0 ? dto.LineItem[0]!.map(i => TicketLineItem.fromDto(i)) : null,
            dto.PaymentDetails?.length > 0 ? dto.PaymentDetails[0]!.map(p => TicketPaymentDetails.fromDto(p)) : null,
            dto.AdditionalInformation?.length > 0 ? AccountingTransactionAdditionalInfo.fromDto(dto.AdditionalInformation[0]!) : null,
            AccountingTransactionHeader.fromDto(dto.Header),
            AccountingTransactionTotals.fromDto(dto.Totals)
        );
    }

}

export class CreateTicketAccountingTransaction {
    OperatorId: string | null;
    OrderId: string | null;
    Tax: TicketTax[] | null;
    LineItemGroups: TicketLineItemGroup[] | null;
    LineItem: TicketLineItem[] | null;
    PaymentDetails: TicketPaymentDetails[] | null;
    AdditionalInformation: AccountingTransactionAdditionalInfo | null;
    Header: AccountingTransactionHeader;
    Totals: AccountingTransactionTotals;

    constructor(
        operatorId: string | null,
        orderId: string | null,
        tax: TicketTax[] | null,
        lineItemGroups: TicketLineItemGroup[] | null,
        lineItem: TicketLineItem[] | null,
        paymentDetails: TicketPaymentDetails[] | null,
        additionalInformation: AccountingTransactionAdditionalInfo | null,
        header: AccountingTransactionHeader,
        totals: AccountingTransactionTotals
    ) {
        this.OperatorId = operatorId;
        this.OrderId = orderId;
        this.Tax = tax;
        this.LineItemGroups = lineItemGroups;
        this.LineItem = lineItem;
        this.PaymentDetails = paymentDetails;
        this.AdditionalInformation = additionalInformation;
        this.Header = header;
        this.Totals = totals;
    }

    toDto(): CreateTicketAccountingTransactionDto {
        return {
            OperatorId: this.OperatorId ? [this.OperatorId] : [],
            OrderId: this.OrderId ? [this.OrderId] : [],
            Tax: this.Tax ? [this.Tax.map(t => t.toDto())] : [],
            LineItemGroups: this.LineItemGroups ? [this.LineItemGroups.map(g => g.toDto())] : [],
            LineItem: this.LineItem ? [this.LineItem.map(i => i.toDto())] : [],
            PaymentDetails: this.PaymentDetails ? [this.PaymentDetails.map(p => p.toDto())] : [],
            AdditionalInformation: this.AdditionalInformation ? [this.AdditionalInformation.toDto()] : [],
            Header: this.Header.toDto(),
            Totals: this.Totals.toDto()
        };
    }

    static fromDto(dto: CreateTicketAccountingTransactionDto): CreateTicketAccountingTransaction {
        return new CreateTicketAccountingTransaction(
            dto.OperatorId?.length > 0 ? dto.OperatorId[0] ?? null : null,
            dto.OrderId?.length > 0 ? dto.OrderId[0] ?? null : null,
            dto.Tax?.length > 0 ? dto.Tax[0]!.map(t => TicketTax.fromDto(t)) : null,
            dto.LineItemGroups?.length > 0 ? dto.LineItemGroups[0]!.map(g => TicketLineItemGroup.fromDto(g)) : null,
            dto.LineItem?.length > 0 ? dto.LineItem[0]!.map(i => TicketLineItem.fromDto(i)) : null,
            dto.PaymentDetails?.length > 0 ? dto.PaymentDetails[0]!.map(p => TicketPaymentDetails.fromDto(p)) : null,
            dto.AdditionalInformation?.length > 0 ? AccountingTransactionAdditionalInfo.fromDto(dto.AdditionalInformation[0]!) : null,
            AccountingTransactionHeader.fromDto(dto.Header),
            AccountingTransactionTotals.fromDto(dto.Totals)
        );
    }
};
