import { AccountingTransactionAdditionalInfoDto, AccountingTransactionDto, AccountingTransactionHeaderDto, AccountingTransactionLineItemTaxDto, AccountingTransactionTotalsDto, AccountingTransactionWithTotalsDto } from "./AccountingTransactionDto";

export class CustomDate {
    year: number;
    month: number;
    day: number;

    constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
}

export enum AccountingTransactionType {
    TICKET = 'TICKET',
    INVOICE = 'INVOICE',
    BANK_TRX = 'BANK_TRX',
}

export enum AccountingTransactionSource {
    ERP = 'ERP',
    INTERNAL = 'INTERNAL',
    BANK = 'BANK',
}

export enum AccountingTransactionTaxTypeCode {
    VAT = 'VAT',
}

export enum AccountingTransactionStatus {
    NOT_ACCOUNTED = 'NOT_ACCOUNTED',
}

export class AccountingTransactionAdditionalInfo {
    Notes?: string | null;

    constructor(notes: string | null) {
        this.Notes = notes;
    }

    toDto(): AccountingTransactionAdditionalInfoDto {
        return new AccountingTransactionAdditionalInfoDto(this.Notes ? [this.Notes] : []);
    }

    static fromDto(dto: AccountingTransactionAdditionalInfoDto): AccountingTransactionAdditionalInfo {
        return new AccountingTransactionAdditionalInfo(dto.Notes ? dto.Notes[0] ?? null : null);
    }
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

    toDto(): AccountingTransactionTotalsDto {
        return new AccountingTransactionTotalsDto(this.TotalTaxAmount, this.TotalExclTax, this.TotalInclTax);
    }

    static fromDto(dto: AccountingTransactionTotalsDto): AccountingTransactionTotals {
        return new AccountingTransactionTotals(dto.TotalTaxAmount, dto.TotalExclTax, dto.TotalInclTax);
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

    toDto(): AccountingTransactionLineItemTaxDto {
        return new AccountingTransactionLineItemTaxDto(this.Amount, this.TypeCode, this.RateApplicablePercent);
    }

    static fromDto(dto: AccountingTransactionLineItemTaxDto): AccountingTransactionLineItemTax {
        return new AccountingTransactionLineItemTax(dto.Amount, dto.TypeCode, dto.RateApplicablePercent);
    }
}

export class AccountingTransactionHeader {
    // DLTERP given ID for the transaction
    DLTERPId: string | null;

    // Currency of the transaction
    Currency: string | null;

    // Transaction total amount
    TotalAmount: number | null;

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
    IssueDate: CustomDate | null;

    // Value Date of accounting transaction
    ValueDate: CustomDate | null;

    // Status of the transaction
    Status: AccountingTransactionStatus | null;

    // Accounting ID of the transaction in the external accounting system
    AccountingId: string | null;

    // Date the transaction was inserted into the external accounting system
    AccountingDate: CustomDate | null;

    // Description of the transaction
    Description: string | null;

    constructor(
        DLTERPId: string | null,
        TotalAmount: number | null,
        Source: AccountingTransactionSource | null,
        TypeCode: AccountingTransactionType,
        TypeKey: string | null,
        ExternalReferenceNumber: string | null,
        IssueDate: CustomDate | null,
        ValueDate: CustomDate | null,
        Currency: string | null,
        Status: AccountingTransactionStatus | null,
        AccountingId: string | null,
        AccountingDate: CustomDate | null,
        Description: string | null
    ) {
        this.DLTERPId = DLTERPId;
        this.TotalAmount = TotalAmount;
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


    toDto(): AccountingTransactionHeaderDto {
        return new AccountingTransactionHeaderDto(
            this.DLTERPId ? [this.DLTERPId] : [],
            this.TotalAmount ? [this.TotalAmount] : [],
            this.Source ? [this.Source] : [],
            this.TypeCode,
            this.TypeKey ? [this.TypeKey] : [],
            this.ExternalReferenceNumber ? [this.ExternalReferenceNumber] : [],
            this.IssueDate ? [this.IssueDate] : [],
            this.ValueDate ? [this.ValueDate] : [],
            this.Currency ? [this.Currency] : [],
            this.Status ? [this.Status] : [],
            this.AccountingId ? [this.AccountingId] : [],
            this.AccountingDate ? [this.AccountingDate] : [],
            this.Description ? [this.Description] : [],
        );
    }

    static fromDto(dto: AccountingTransactionHeaderDto): AccountingTransactionHeader {
        console.log("converting trx dto: ", dto);
        return new AccountingTransactionHeader(
            dto.DLTERPId?.length > 0 ? dto.DLTERPId[0] ?? null : null,
            dto.TotalAmount?.length > 0 ? dto.TotalAmount[0] ?? null : null,
            dto.Source?.length > 0 ? dto.Source[0] ?? null : null,
            dto.TypeCode,
            dto.TypeKey?.length > 0 ? dto.TypeKey[0] ?? null : null,
            dto.ExternalReferenceNumber?.length > 0 ? dto.ExternalReferenceNumber[0] ?? null : null,
            dto.IssueDate?.length > 0 ? dto.IssueDate[0] ?? null : null,
            dto.ValueDate?.length > 0 ? dto.ValueDate[0] ?? null : null,
            dto.Currency?.length > 0 ? dto.Currency[0] ?? null : null,
            dto.Status?.length > 0 ? dto.Status[0] ?? null : null,
            dto.AccountingId?.length > 0 ? dto.AccountingId[0] ?? null : null,
            dto.AccountingDate?.length > 0 ? dto.AccountingDate[0] ?? null : null,
            dto.Description?.length > 0 ? dto.Description[0] ?? null : null,
        );
    }
}

export class AccountingTransaction {
    // Header of the transaction
    Header: AccountingTransactionHeader;

    constructor(header: AccountingTransactionHeader) {
        this.Header = header;
    }

    toDto(): AccountingTransactionDto {
        return new AccountingTransactionDto(this.Header.toDto());
    }
}

export class AccountingTransactionWithTotals extends AccountingTransaction {
    Totals: AccountingTransactionTotals;

    constructor(header: AccountingTransactionHeader, totals: AccountingTransactionTotals) {
        super(header);
        this.Totals = totals;
    }

    toDto(): AccountingTransactionWithTotalsDto {
        const dto = super.toDto();
        return new AccountingTransactionWithTotalsDto(dto.Header, this.Totals.toDto());
    }
}
