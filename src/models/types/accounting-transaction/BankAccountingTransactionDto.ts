import { AccountingTransactionDto, AccountingTransactionHeaderDto } from "./AccountingTransactionDto";

export enum BankTransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
}

export class BankTransactionAddressDTO {
    StreetName: [string] | [];
    BuildingNumber: [string] | [];
    PostCode: [string] | [];
    TownName: [string] | [];
    Country: [string] | [];
    AddressLines: [string[]] | [];

    constructor(
        streetName: [string] | [],
        buildingNumber: [string] | [],
        postCode: [string] | [],
        townName: [string] | [],
        country: [string] | [],
        addressLines: [string[]] | []
    ) {
        this.StreetName = streetName;
        this.BuildingNumber = buildingNumber;
        this.PostCode = postCode;
        this.TownName = townName;
        this.Country = country;
        this.AddressLines = addressLines;
    }
}

export class BankTransactionAccountDTO {
    IBAN: string;
    Owner: [string] | [];
    FinancialInstitutionId: [string] | [];

    constructor(IBAN: string, Owner: [string] | [], FinancialInstitutionId: [string] | []) {
        this.IBAN = IBAN;
        this.Owner = Owner;
        this.FinancialInstitutionId = FinancialInstitutionId;
    }
}

export class BankTransactionCounterpartDTO {
    Name: string;
    Account: [BankTransactionAccountDTO] | [];
    Address: BankTransactionAddressDTO

    constructor(
        Name: string,
        Account: [BankTransactionAccountDTO] | [],
        Address: BankTransactionAddressDTO,
    ) {
        this.Name = Name;
        this.Account = Account;
        this.Address = Address;
    }
}

export class BankTransactionCounterpartAgentDTO {
    Name: string;
    BICFI: [string] | [];
    Address: BankTransactionAddressDTO;

    constructor(
        Name: string,
        BICFI: [string] | [],
        Address: BankTransactionAddressDTO,
    ) {
        this.Name = Name;
        this.BICFI = BICFI;
        this.Address = Address;
    }
}

export class BankTransactionReferencesDTO {
    AccountSvcrRef: string;
    EndToEndId: [string] | [];

    constructor(AccountSvcrRef: string, EndToEndId: [string] | []) {
        this.AccountSvcrRef = AccountSvcrRef;
        this.EndToEndId = EndToEndId;
    }
}

export class BankTransactionStructuredRemittanceInformationDTO {
    ProprietaryCode: [string] | [];
    Reference: [string] | [];

    constructor(ProperietaryCode: [string] | [], Reference: [string] | []) {
        this.ProprietaryCode = ProperietaryCode;
        this.Reference = Reference;
    }
}

export class BankTransactionRemittanceInformationDTO {
    TextualInformation: [string] | [];
    StructuredInformation: [BankTransactionStructuredRemittanceInformationDTO] | [];

    constructor(TextualInformation: [string] | [], StructuredInformation: [BankTransactionStructuredRemittanceInformationDTO] | []) {
        this.TextualInformation = TextualInformation;
        this.StructuredInformation = StructuredInformation;
    }
}

export class BankTransactionDebtorDTO {
    Name: string;
    Address: BankTransactionAddressDTO;

    constructor(Name: string, Address: BankTransactionAddressDTO) {
        this.Name = Name;
        this.Address = Address;
    }
}

export class BankAccountingTransactionDTO extends AccountingTransactionDto {
    Type: BankTransactionType;
    Account: BankTransactionAccountDTO;
    Counterpart: [BankTransactionCounterpartDTO] | [];
    CounterpartAgent: [BankTransactionCounterpartAgentDTO] | [];
    Debtor: [BankTransactionDebtorDTO] | [];
    References: BankTransactionReferencesDTO;
    RemittanceInformation: BankTransactionRemittanceInformationDTO;
    AdditionalInfo: string[];
    DomainCode: [string] | [];
    FamilyCode: [string] | [];
    SubFamilyCode: [string] | [];

    constructor(
        Type: BankTransactionType,
        Account: BankTransactionAccountDTO,
        References: BankTransactionReferencesDTO,
        RemittanceInformation: BankTransactionRemittanceInformationDTO,
        AdditionalInfo: string[],
        Header: AccountingTransactionHeaderDto,
        DomainCode: [string] | [],
        FamilyCode: [string] | [],
        SubFamilyCode: [string] | [],
        Counterpart: [BankTransactionCounterpartDTO] | [],
        CounterpartAgent: [BankTransactionCounterpartAgentDTO] | [],
        Debtor: [BankTransactionDebtorDTO] | [],
    ) {
        super(Header);
        this.Type = Type;
        this.Account = Account;
        this.Counterpart = Counterpart;
        this.CounterpartAgent = CounterpartAgent;
        this.Debtor = Debtor;
        this.References = References;
        this.RemittanceInformation = RemittanceInformation;
        this.AdditionalInfo = AdditionalInfo;
        this.DomainCode = DomainCode;
        this.FamilyCode = FamilyCode;
        this.SubFamilyCode = SubFamilyCode;
    }
}
