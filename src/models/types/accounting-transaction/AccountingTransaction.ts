
export enum AccountingTransactionType {
    TICKET = 'TICKET',
    INVOICE = 'INVOICE',
}

export enum AccountingTransactionSource {
    ERP = 'ERP',
    INTERNAL = 'INTERNAL',
}

export enum AccountingTransactionTaxTypeCode {
    VAT = 'VAT',
}

export enum AccountingTransactionStatus {
    NOT_ACCOUNTED = 'NOT_ACCOUNTED',
}

export class AccountingTransactionAdditionalInfo {
    Notes?: string | null;
}

export class AccountingTransactionTotals {

    TotalTaxAmount: number;

    TotalExclTax: number;

    TotalInclTax: number;

    constructor(totalTaxAmount: number, totalExclTax: number, totalInclTax: number) {
        this.TotalTaxAmount = totalTaxAmount;
        this.TotalExclTax = totalExclTax;
        this.TotalInclTax = totalInclTax;
    }
}

export class AccountingTransactionLineItemTax {

    Amount: number;

    TypeCode: AccountingTransactionTaxTypeCode;

    RateApplicablePercent: number;

    constructor(amount: number, typeCode: AccountingTransactionTaxTypeCode, rateApplicablePercent: number) {
        this.Amount = amount;
        this.TypeCode = typeCode;
        this.RateApplicablePercent = rateApplicablePercent;
    }
}

export class AccountingTransactionHeader {
    // DLTERP given ID for the transaction
    DLTERPId: string;

    // Source of the ticket, for now it is always "ERP"
    Source: AccountingTransactionSource | null;

    // Type of transaction e.g. TICKET or INVOICE
    TypeCode: AccountingTransactionType;

    // name of the cashier or IBAN involved in the operation
    // For now it is always the cashier name i.e. DLTERP for web payments
    // TODO: still need to find a way to report the real cashier name when paying at the cash desk
    TypeKey: string | null;

    // External reference number of the transaction
    // depends on the source, e.g. for Source=ERP it is the ticket number returned from the ERP
    ExternalReferenceNumber: string | null;

    // Issue date of the transaction
    IssueDate: Date | null;

    // Value Date of accounting transaction
    ValueDate: Date | null;

    // Currency of the transaction
    Currency: string | null;

    // Status of the transaction
    Status: AccountingTransactionStatus | null;

    // Accounting ID of the transaction in the external accounting system
    AccountingId: string | null;

    // Date the transaction was inserted into the external accounting system
    AccountingDate: Date | null;

    // Description of the transaction
    Description: string | null;

    constructor(
        DLTERPId: string,
        Source: AccountingTransactionSource | null,
        TypeCode: AccountingTransactionType,
        TypeKey: string | null,
        ExternalReferenceNumber: string | null,
        IssueDate: Date | null,
        ValueDate: Date | null,
        Currency: string | null,
        Status: AccountingTransactionStatus | null,
        AccountingId: string | null,
        AccountingDate: Date | null,
        Description: string | null
    ) {
        this.DLTERPId = DLTERPId;
        this.Source = Source;
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

export abstract class AccountingTransaction {
    // Header of the transaction
    Header: AccountingTransactionHeader;

    constructor(header: AccountingTransactionHeader) {
        this.Header = header;
    }
}

export abstract class AccountingTransactionWithTotals extends AccountingTransaction {
    Totals: AccountingTransactionTotals;

    constructor(header: AccountingTransactionHeader, totals: AccountingTransactionTotals) {
        super(header);
        this.Totals = totals;
    }

}
