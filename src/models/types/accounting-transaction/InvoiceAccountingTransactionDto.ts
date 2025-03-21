import { AccountingTransactionLineItemTax, AccountingTransactionTaxTypeCode } from "./AccountingTransaction";
import { AccountingTransactionAdditionalInfoDto, AccountingTransactionHeaderDto, AccountingTransactionTotalsDto, AccountingTransactionWithTotalsDto } from "./AccountingTransactionDto";

export class InvoiceAddressDTO {
    constructor(
        public StreetOne: string,
        public StreetTwo: [string] | [],
        public PostalCode: string,
        public CountryCode: string
    ) { }
}

export class InvoiceContactDTO {
    constructor(
        public Name: string,
        public Email: string,
        public Phone: string
    ) { }
}

export class InvoiceCompanyDTO {
    constructor(
        public ID: string,
        public Name: string,
        public Address: InvoiceAddressDTO,
        public Contact: InvoiceContactDTO
    ) { }
}

export class InvoiceTaxDTO {
    constructor(
        public Amount: number,
        public TypeCode: AccountingTransactionTaxTypeCode,
        public RateApplicablePercent: number
    ) { }
}

export class InvoiceLineItemDTO {
    constructor(
        public ItemCode: string,
        public Description: string,
        public Quantity: number,
        public UnitCode: string,
        public UnitPrice: number,
        public TotalInclTax: number,
        public TotalExclTax: number,
        public Tax: AccountingTransactionLineItemTax
    ) { }
}

export class PaymentPayeeDTO {
    constructor(
        public Name: string,
        public StreetOne: string,
        public PostalCode: string,
        public City: string,
        public CountryCode: string
    ) { }
}

export class InvoicePaymentDetailsDTO {
    constructor(
        public IBAN: string,
        public Reference: string,
        public BicSwift: string,
        public QR: string,
        public Bank: any,
        public Payee: PaymentPayeeDTO
    ) { }
}

export class InvoiceAttachmentsDTO {
    constructor(
        public FileName: string,
        public FileType: string,
        public DocumentId: number
    ) { }
}

export class InvoiceAccountingTransactionDTO extends AccountingTransactionWithTotalsDto {
    constructor(
        public Tax: InvoiceTaxDTO[],
        public Seller: InvoiceCompanyDTO,
        public Buyer: InvoiceCompanyDTO,
        public LineItem: InvoiceLineItemDTO[],
        public Payment: InvoicePaymentDetailsDTO,
        public Attachments: InvoiceAttachmentsDTO[],
        public AdditionalInformation: AccountingTransactionAdditionalInfoDto,
        public Header: AccountingTransactionHeaderDto,
        public Totals: AccountingTransactionTotalsDto
    ) {
        super(
            Header,
            Totals
        );
    }
}
