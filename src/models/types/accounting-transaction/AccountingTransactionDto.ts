import { type AccountingTransactionSource, type AccountingTransactionStatus, type AccountingTransactionTaxTypeCode, type AccountingTransactionType, type CustomDate } from "./AccountingTransaction";

export class AccountingTransactionAdditionalInfoDto {
    Notes: [string] | [];

    constructor(notes: [string] | []) {
        this.Notes = notes;
    }
}

export class AccountingTransactionTotalsDto {

    TotalTaxAmount: number;

    TotalExclTax: number;

    TotalInclTax: number;

    constructor(totalTaxAmount: number, totalExclTax: number, totalInclTax: number) {
        this.TotalTaxAmount = totalTaxAmount;
        this.TotalExclTax = totalExclTax;
        this.TotalInclTax = totalInclTax;
    }
}

export class AccountingTransactionLineItemTaxDto {

    Amount: number;

    TypeCode: AccountingTransactionTaxTypeCode;

    RateApplicablePercent: number;

    constructor(amount: number, typeCode: AccountingTransactionTaxTypeCode, rateApplicablePercent: number) {
        this.Amount = amount;
        this.TypeCode = typeCode;
        this.RateApplicablePercent = rateApplicablePercent;
    }
}

export class AccountingTransactionHeaderDto {
    DLTERPId: [string] | [];

    Currency: [string] | [];

    TotalAmount: [number] | [];

    Source: [AccountingTransactionSource] | [];

    StoreId: number;

    TypeCode: AccountingTransactionType;

    TypeKey: [string] | [];

    ExternalReferenceNumber: [string] | [];

    IssueDate: [CustomDate] | [];

    ValueDate: [CustomDate] | [];

    Status: [AccountingTransactionStatus] | [];

    AccountingId: [string] | [];

    AccountingDate: [CustomDate] | [];

    Description: [string] | [];

    constructor(
        DLTERPId: [string] | [],
        TotalAmount: [number] | [],
        Source: [AccountingTransactionSource] | [],
        StoreId: number,
        TypeCode: AccountingTransactionType,
        TypeKey: [string] | [],
        ExternalReferenceNumber: [string] | [],
        IssueDate: [CustomDate] | [],
        ValueDate: [CustomDate] | [],
        Currency: [string] | [],
        Status: [AccountingTransactionStatus] | [],
        AccountingId: [string] | [],
        AccountingDate: [CustomDate] | [],
        Description: [string] | []
    ) {
        this.DLTERPId = DLTERPId;
        this.TotalAmount = TotalAmount;
        this.Source = Source;
        this.StoreId = StoreId;
        this.TypeCode = TypeCode;
        this.TypeKey = TypeKey;
        this.ExternalReferenceNumber = ExternalReferenceNumber;
        this.IssueDate = IssueDate;
        this.ValueDate = ValueDate;
        this.Currency = Currency;
        this.Status = Status;
        this.AccountingId = AccountingId;
        this.AccountingDate = AccountingDate;
        this.Description = Description;
    }
}

export class AccountingTransactionDto {
    Header: AccountingTransactionHeaderDto;

    constructor(header: AccountingTransactionHeaderDto) {
        this.Header = header;
    }
}

export class AccountingTransactionWithTotalsDto extends AccountingTransactionDto {
    Totals: AccountingTransactionTotalsDto;

    constructor(header: AccountingTransactionHeaderDto, totals: AccountingTransactionTotalsDto) {
        super(header);
        this.Totals = totals;
    }
}

