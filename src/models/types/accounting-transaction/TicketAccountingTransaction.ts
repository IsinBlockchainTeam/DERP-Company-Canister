// Represent a product group in the ticket
import { Presentable } from "../Presentable";
import {
    AccountingTransactionAdditionalInfo,
    AccountingTransactionHeader,
    AccountingTransactionLineItemTax,
    AccountingTransactionTaxTypeCode, AccountingTransactionTotals,
    AccountingTransactionWithTotals,
} from "./AccountingTransaction";
import { TicketAccountingTransactionDto, TicketLineItemDto, TicketLineItemGroupDto, TicketPaymentDetailsDto, TicketTaxDto } from "./TicketAccountingTransactionDto";

export class TicketLineItemGroup implements Presentable<TicketLineItemGroupDto> {
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

export class TicketTax implements Presentable<TicketTaxDto> {
    // ID of the tax
    Id: string;

    // Total tax amount over the tax
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

export class TicketLineItem implements Presentable<TicketLineItemDto> {
    // ID of the product group
    ItemGroupId?: string;

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
    TotalExclTax?: number;

    // Tax applied to the product
    Tax: AccountingTransactionLineItemTax;

    constructor(itemGroupId: string | undefined, itemCode: string, description: string, quantity: number, unitCode: string, unitPrice: number, totalInclTax: number, totalExclTax: number | undefined, tax: AccountingTransactionLineItemTax) {
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
        return new TicketLineItemDto(this.ItemGroupId ? [this.ItemGroupId] : [], this.ItemCode, this.Description, this.Quantity, this.UnitCode, this.UnitPrice, this.TotalInclTax, this.TotalExclTax ? [this.TotalExclTax] : [], this.Tax.toDto());
    }

    static fromDto(dto: TicketLineItemDto): TicketLineItem {
        return new TicketLineItem(dto.ItemGroupId[0], dto.ItemCode, dto.Description, dto.Quantity, dto.UnitCode, dto.UnitPrice, dto.TotalInclTax, dto.TotalExclTax[0], AccountingTransactionLineItemTax.fromDto(dto.Tax));
    }
}

export class TicketPaymentDetails implements Presentable<TicketPaymentDetailsDto> {
    id: string;
    payerAddress: string | null;
    payeeAddress: string | null;
    paymentCurrencyAmount: number;
    issueDate: Date;
    paymentType: string;
    paymentTypeId: string;
    paymentCurrency: string;
    exchangeRate: number;
    amount: number;
    externalId: string;
    creditCardDescription?: string | null;
    creditCardNum?: string | null;
    creditCardAuthorizationDate?: Date | null;
    creditCardAuthorizationNum?: string | null;
    creditCardTerminalCode?: string | null;

    constructor(id: string, payerAddress: string | null, payeeAddress: string | null, paymentCurrencyAmount: number, issueDate: Date, paymentType: string, paymentTypeId: string, paymentCurrency: string, exchangeRate: number, amount: number, externalId: string, creditCardDescription?: string | null, creditCardNum?: string | null, creditCardAuthorizationDate?: Date | null, creditCardAuthorizationNum?: string | null, creditCardTerminalCode?: string | null) {
        this.id = id;
        this.payerAddress = payerAddress;
        this.payeeAddress = payeeAddress;
        this.paymentCurrencyAmount = paymentCurrencyAmount;
        this.issueDate = issueDate;
        this.paymentType = paymentType;
        this.paymentTypeId = paymentTypeId;
        this.paymentCurrency = paymentCurrency;
        this.exchangeRate = exchangeRate;
        this.amount = amount;
        this.externalId = externalId;
        this.creditCardDescription = creditCardDescription;
        this.creditCardNum = creditCardNum;
        this.creditCardAuthorizationDate = creditCardAuthorizationDate;
        this.creditCardAuthorizationNum = creditCardAuthorizationNum;
        this.creditCardTerminalCode = creditCardTerminalCode;
    }

    toDto(): TicketPaymentDetailsDto {
        return new TicketPaymentDetailsDto(this.id,
            this.payerAddress ? [this.payerAddress] : [],
            this.payeeAddress ? [this.payeeAddress] : [],
            this.paymentCurrencyAmount,
            this.issueDate.toISOString(),
            this.paymentType,
            this.paymentTypeId,
            this.paymentCurrency,
            this.exchangeRate,
            this.amount,
            this.externalId,
            this.creditCardDescription ? [this.creditCardDescription] : [],
            this.creditCardNum ? [this.creditCardNum] : [],
            this.creditCardAuthorizationDate ? [this.creditCardAuthorizationDate.toISOString()] : [],
            this.creditCardAuthorizationNum ? [this.creditCardAuthorizationNum] : [],
            this.creditCardTerminalCode ? [this.creditCardTerminalCode] : []);
    }

    static fromDto(dto: TicketPaymentDetailsDto): TicketPaymentDetails {
        return new TicketPaymentDetails(dto.id,
            dto.payerAddress.length > 0 ? dto.payerAddress[0] ?? null : null,
            dto.payeeAddress.length > 0 ? dto.payeeAddress[0] ?? null : null,
            dto.paymentCurrencyAmount,
            new Date(dto.issueDate),
            dto.paymentType, 
            dto.paymentTypeId,
            dto.paymentCurrency, 
            dto.exchangeRate, 
            dto.amount, 
            dto.externalId,
            dto.creditCardDescription.length > 0 ? dto.creditCardDescription[0] ?? null : null,
            dto.creditCardNum.length > 0 ? dto.creditCardNum[0] ?? null : null,
            dto.creditCardAuthorizationDate.length > 0 ? new Date(dto.creditCardAuthorizationDate[0]!) : null,
            dto.creditCardAuthorizationNum.length > 0 ? dto.creditCardAuthorizationNum[0] ?? null : null,
            dto.creditCardTerminalCode.length > 0 ? dto.creditCardTerminalCode[0] ?? null : null);
    }
}

export class TicketAccountingTransaction extends AccountingTransactionWithTotals implements Presentable<TicketAccountingTransactionDto> {
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
        console.log("ToDTO:")
        console.log(JSON.stringify(this.Tax, null, 2));
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
        console.log("FromDTO:")
        console.log(JSON.stringify(dto.Tax, null, 2));
        return new TicketAccountingTransaction(
            dto.OperatorId?.length > 0 ? dto.OperatorId[0] ?? null : null,
            dto.OrderId?.length > 0 ? dto.OrderId[0] ?? null : null,
            dto.Tax?.length > 0 ? dto.Tax[0]!.map(t => TicketTax.fromDto(t)) : null,
            dto.LineItemGroups?.length > 0 ? dto.LineItemGroups[0]!.map(g => TicketLineItemGroup.fromDto(g)) : null,
            dto.LineItem.length > 0 ? dto.LineItem[0]!.map(i => TicketLineItem.fromDto(i)) : null,
            dto.PaymentDetails?.length > 0 ? dto.PaymentDetails[0]!.map(p => TicketPaymentDetails.fromDto(p)) : null,
            dto.AdditionalInformation?.length > 0 ? AccountingTransactionAdditionalInfo.fromDto(dto.AdditionalInformation[0]!) : null,
            AccountingTransactionHeader.fromDto(dto.Header),
            AccountingTransactionTotals.fromDto(dto.Totals)
        );
    }

}
