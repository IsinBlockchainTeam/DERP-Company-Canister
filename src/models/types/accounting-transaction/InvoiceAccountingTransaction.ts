import { AccountingTransactionAdditionalInfo, AccountingTransactionHeader, AccountingTransactionLineItemTax, AccountingTransactionTaxTypeCode, AccountingTransactionTotals, AccountingTransactionWithTotals } from "./AccountingTransaction";
import {
    type InvoiceAddressDTO,
    type InvoiceContactDTO,
    type InvoiceCompanyDTO,
    type InvoiceTaxDTO,
    type InvoiceLineItemDTO,
    type InvoicePaymentDetailsDTO,
    type InvoiceAttachmentsDTO,
    type InvoiceAccountingTransactionDTO,
    PaymentPayeeDTO,
} from "./InvoiceAccountingTransactionDto";

export class InvoiceAddress {
    StreetOne: string;
    StreetTwo?: string | null;
    PostalCode: string;
    CountryCode: string;

    constructor(StreetOne: string, PostalCode: string, CountryCode: string, StreetTwo?: string | null) {
        this.StreetOne = StreetOne;
        this.StreetTwo = StreetTwo;
        this.PostalCode = PostalCode;
        this.CountryCode = CountryCode;
    }

    static fromDTO(dto: InvoiceAddressDTO): InvoiceAddress {
        return new InvoiceAddress(dto.StreetOne, dto.PostalCode, dto.CountryCode, dto.StreetTwo.length > 0 ? dto.StreetTwo[0] : null);
    }

    toDto(): InvoiceAddressDTO {
        return {
            StreetOne: this.StreetOne,
            StreetTwo: this.StreetTwo ? [this.StreetTwo] : [],
            PostalCode: this.PostalCode,
            CountryCode: this.CountryCode,
        };
    }
}

export class InvoiceContact {
    Name: string;
    Email: string;
    Phone: string;

    constructor(Name: string, Email: string, Phone: string) {
        this.Name = Name;
        this.Email = Email;
        this.Phone = Phone;
    }

    static fromDTO(dto: InvoiceContactDTO): InvoiceContact {
        return new InvoiceContact(dto.Name, dto.Email, dto.Phone);
    }

    toDto(): InvoiceContactDTO {
        return {
            Name: this.Name,
            Email: this.Email,
            Phone: this.Phone,
        };
    }
}

export class InvoiceCompany {
    ID: string;

    Name: string;

    Address: InvoiceAddress;

    Contact: InvoiceContact;

    constructor(ID: string, Name: string, Address: InvoiceAddress, Contact: InvoiceContact) {
        this.ID = ID;
        this.Name = Name;
        this.Address = Address;
        this.Contact = Contact;
    }

    static fromDTO(dto: InvoiceCompanyDTO): InvoiceCompany {
        return new InvoiceCompany(dto.ID, dto.Name, InvoiceAddress.fromDTO(dto.Address), InvoiceContact.fromDTO(dto.Contact));
    }

    toDto(): InvoiceCompanyDTO {
        return {
            ID: this.ID,
            Name: this.Name,
            Address: this.Address.toDto(),
            Contact: this.Contact.toDto(),
        };
    }
}

export class InvoiceTax {
    Amount: number;

    TypeCode: AccountingTransactionTaxTypeCode;

    RateApplicablePercent: number;

    constructor(Amount: number, TypeCode: AccountingTransactionTaxTypeCode, RateApplicablePercent: number) {
        this.Amount = Amount;
        this.TypeCode = TypeCode;
        this.RateApplicablePercent = RateApplicablePercent;
    }

    static fromDTO(dto: InvoiceTaxDTO): InvoiceTax {
        return new InvoiceTax(dto.Amount, dto.TypeCode, dto.RateApplicablePercent);
    }

    toDto(): InvoiceTaxDTO {
        return {
            Amount: this.Amount,
            TypeCode: this.TypeCode,
            RateApplicablePercent: this.RateApplicablePercent,
        };
    }
}

export class InvoiceLineItem {
    ItemCode: string;
    Description: string;
    Quantity: number;
    UnitCode: string;
    UnitPrice: number;
    TotalInclTax: number;
    TotalExclTax: number;
    Tax: AccountingTransactionLineItemTax;

    constructor(ItemCode: string, Description: string, Quantity: number, UnitCode: string, UnitPrice: number, TotalInclTax: number, TotalExclTax: number, Tax: AccountingTransactionLineItemTax) {
        this.ItemCode = ItemCode;
        this.Description = Description;
        this.Quantity = Quantity;
        this.UnitCode = UnitCode;
        this.UnitPrice = UnitPrice;
        this.TotalInclTax = TotalInclTax;
        this.TotalExclTax = TotalExclTax;
        this.Tax = Tax;
    }

    static fromDTO(dto: InvoiceLineItemDTO): InvoiceLineItem {
        return new InvoiceLineItem(dto.ItemCode, dto.Description, dto.Quantity, dto.UnitCode, dto.UnitPrice, dto.TotalInclTax, dto.TotalExclTax, dto.Tax);
    }

    toDto(): InvoiceLineItemDTO {
        return {
            ItemCode: this.ItemCode,
            Description: this.Description,
            Quantity: this.Quantity,
            UnitCode: this.UnitCode,
            UnitPrice: this.UnitPrice,
            TotalInclTax: this.TotalInclTax,
            TotalExclTax: this.TotalExclTax,
            Tax: this.Tax,
        };
    }
}

export class PaymentPayee {
    Name: string;
    StreetOne: string;
    PostalCode: string;
    City: string;
    CountryCode: string;

    constructor(Name: string, StreetOne: string, PostalCode: string, City: string, CountryCode: string) {
        this.Name = Name;
        this.StreetOne = StreetOne;
        this.PostalCode = PostalCode;
        this.City = City;
        this.CountryCode = CountryCode;
    }

    static fromDTO(dto: PaymentPayeeDTO): PaymentPayee {
        return new PaymentPayee(dto.Name, dto.StreetOne, dto.PostalCode, dto.City, dto.CountryCode);
    }

    toDto(): PaymentPayeeDTO {
        return {
            Name: this.Name,
            StreetOne: this.StreetOne,
            PostalCode: this.PostalCode,
            City: this.City,
            CountryCode: this.CountryCode,
        };
    }
}

export class InvoicePaymentDetails {
    IBAN: string;
    Reference: string;
    BicSwift: string;
    QR: string;
    Bank: any;
    Payee: PaymentPayee;

    constructor(IBAN: string, Reference: string, BicSwift: string, QR: string, Bank: any, Payee: PaymentPayee) {
        this.IBAN = IBAN;
        this.Reference = Reference;
        this.BicSwift = BicSwift;
        this.QR = QR;
        this.Bank = Bank;
        this.Payee = Payee;
    }

    static fromDTO(dto: InvoicePaymentDetailsDTO): InvoicePaymentDetails {
        return new InvoicePaymentDetails(dto.IBAN, dto.Reference, dto.BicSwift, dto.QR, dto.Bank, PaymentPayee.fromDTO(dto.Payee));
    }

    toDto(): InvoicePaymentDetailsDTO {
        return {
            IBAN: this.IBAN,
            Reference: this.Reference,
            BicSwift: this.BicSwift,
            QR: this.QR,
            Bank: this.Bank,
            Payee: this.Payee.toDto(),
        };
    }
}

export class InvoiceAttachments {
    FileName: string;
    FileType: string;
    DocumentId: number;

    constructor(FileName: string, FileType: string, DocumentId: number) {
        this.FileName = FileName;
        this.FileType = FileType;
        this.DocumentId = DocumentId;
    }

    static fromDTO(dto: InvoiceAttachmentsDTO): InvoiceAttachments {
        return new InvoiceAttachments(dto.FileName, dto.FileType, dto.DocumentId);
    }

    toDto(): InvoiceAttachmentsDTO {
        return {
            FileName: this.FileName,
            FileType: this.FileType,
            DocumentId: this.DocumentId,
        };
    }
}

export class InvoiceAccountingTransaction extends AccountingTransactionWithTotals {
    Tax: InvoiceTax[];
    Seller: InvoiceCompany;
    Buyer: InvoiceCompany;
    LineItem: InvoiceLineItem[];
    Payment: InvoicePaymentDetails;
    Attachments: InvoiceAttachments[];
    AdditionalInformation: AccountingTransactionAdditionalInfo;

    constructor(Tax: InvoiceTax[], Seller: InvoiceCompany,
        Buyer: InvoiceCompany,
        LineItem: InvoiceLineItem[],
        Payment: InvoicePaymentDetails,
        Attachments: InvoiceAttachments[],
        AdditionalInformation: AccountingTransactionAdditionalInfo,
        header: AccountingTransactionHeader,
        totals: AccountingTransactionTotals
    ) {
        super(header, totals);
        this.Tax = Tax;
        this.Seller = Seller;
        this.Buyer = Buyer;
        this.LineItem = LineItem;
        this.Payment = Payment;
        this.Attachments = Attachments;
        this.AdditionalInformation = AdditionalInformation;
    }

    static fromDto(dto: InvoiceAccountingTransactionDTO): InvoiceAccountingTransaction {
        return new InvoiceAccountingTransaction(
            dto.Tax.map(InvoiceTax.fromDTO),
            InvoiceCompany.fromDTO(dto.Seller),
            InvoiceCompany.fromDTO(dto.Buyer),
            dto.LineItem.map(InvoiceLineItem.fromDTO),
            InvoicePaymentDetails.fromDTO(dto.Payment),
            dto.Attachments.map(InvoiceAttachments.fromDTO),
            AccountingTransactionAdditionalInfo.fromDto(dto.AdditionalInformation),
            AccountingTransactionHeader.fromDto(dto.Header),
            AccountingTransactionTotals.fromDto(dto.Totals)
        );
    }

    toDto(): InvoiceAccountingTransactionDTO {
        return {
            Tax: this.Tax.map(tax => tax.toDto()),
            Seller: this.Seller.toDto(),
            Buyer: this.Buyer.toDto(),
            LineItem: this.LineItem.map(lineItem => lineItem.toDto()),
            Payment: this.Payment.toDto(),
            Attachments: this.Attachments.map(attachment => attachment.toDto()),
            AdditionalInformation: this.AdditionalInformation.toDto(),
            Header: this.Header.toDto(),
            Totals: this.Totals.toDto()
        };
    }
}
