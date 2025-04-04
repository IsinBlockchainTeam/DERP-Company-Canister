import { AccountingTransaction, AccountingTransactionHeader } from "./AccountingTransaction";
import { BankAccountingTransactionDTO, BankTransactionAccountDTO, BankTransactionAddressDTO, BankTransactionCounterpartAgentDTO, BankTransactionCounterpartDTO, BankTransactionDebtorDTO, BankTransactionReferencesDTO, BankTransactionRemittanceInformationDTO, BankTransactionStructuredRemittanceInformationDTO } from "./BankAccountingTransactionDto";
export enum BankTransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
}

export class BankTransactionAddress {
    StreetName?: string;
    BuildingNumber?: string;
    PostCode?: string;
    TownName?: string;
    Country?: string;
    AddressLines?: string[];

    constructor(
        streetName?: string,
        buildingNumber?: string,
        postCode?: string,
        townName?: string,
        country?: string,
        addressLines?: string[]
    ) {
        this.StreetName = streetName;
        this.BuildingNumber = buildingNumber;
        this.PostCode = postCode;
        this.TownName = townName;
        this.Country = country;
        this.AddressLines = addressLines;
    }

    static fromDto(dto: BankTransactionAddressDTO): BankTransactionAddress {
        if (
            dto.StreetName.length && dto.StreetName[0] &&
            dto.BuildingNumber.length && dto.BuildingNumber[0] &&
            dto.PostCode.length && dto.PostCode[0] &&
            dto.TownName.length && dto.TownName[0] &&
            dto.Country.length && dto.Country[0]
        )
            return new BankTransactionAddress(
                dto.StreetName[0],
                dto.BuildingNumber[0],
                dto.PostCode[0],
                dto.TownName[0],
                dto.Country[0],
                undefined
            );
        else 
            return new BankTransactionAddress(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                dto.AddressLines[0]
            );

    }

    toDto(): BankTransactionAddressDTO {
        return {
            StreetName: this.StreetName ? [this.StreetName] : [],
            BuildingNumber: this.BuildingNumber ? [this.BuildingNumber] : [],
            PostCode: this.PostCode ? [this.PostCode] : [],
            TownName: this.TownName ? [this.TownName] : [],
            Country: this.Country ? [this.Country] : [],
            AddressLines: this.AddressLines ? [this.AddressLines] : [],
        };
    }
}

export class BankTransactionAccount {
    IBAN: string;
    Owner?: string;
    FinancialInstitutionId?: string;

    constructor(IBAN: string, Owner?: string, FinancialInstitutionId?: string) {
        this.IBAN = IBAN;
        this.Owner = Owner;
        this.FinancialInstitutionId = FinancialInstitutionId;
    }

    static fromDto(dto: BankTransactionAccountDTO): BankTransactionAccount {
        return new BankTransactionAccount(
            dto.IBAN,
            dto.Owner.length > 0 ? dto.Owner[0] : undefined,
            dto.FinancialInstitutionId.length > 0 ? dto.FinancialInstitutionId[0] : undefined
        );
    }

    toDto(): BankTransactionAccountDTO {
        return {
            IBAN: this.IBAN,
            Owner: this.Owner ? [this.Owner] : [],
            FinancialInstitutionId: this.FinancialInstitutionId ? [this.FinancialInstitutionId] : [],
        };
    }
}

export class BankTransactionCounterpart {
    Name: string;
    Account: BankTransactionAccount;
    Address: BankTransactionAddress;

    constructor(
        Name: string,
        Account: BankTransactionAccount,
        Address: BankTransactionAddress
    ) {
        this.Name = Name;
        this.Account = Account;
        this.Address = Address;
    }

    static fromDto(dto: BankTransactionCounterpartDTO): BankTransactionCounterpart {
        return new BankTransactionCounterpart(
            dto.Name,
            BankTransactionAccount.fromDto(dto.Account),
            BankTransactionAddress.fromDto(dto.Address)
        );
    }

    toDto(): BankTransactionCounterpartDTO {
        return {
            Name: this.Name,
            Account: this.Account.toDto(),
            Address: this.Address.toDto()
        };
    }
}

export class BankTransactionCounterpartAgent {
    Name: string;
    BICFI: string;
    Address: BankTransactionAddress;

    constructor(
        Name: string,
        BICFI: string,
        Address: BankTransactionAddress,
    ) {
        this.Name = Name;
        this.BICFI = BICFI;
        this.Address = Address;
    }

    static fromDto(dto: BankTransactionCounterpartAgentDTO): BankTransactionCounterpartAgent {
        return new BankTransactionCounterpartAgent(
            dto.Name,
            dto.BICFI,
            BankTransactionAddress.fromDto(dto.Address)
        );
    }

    toDto(): BankTransactionCounterpartAgentDTO {
        return {
            Name: this.Name,
            BICFI: this.BICFI,
            Address: this.Address.toDto()
        };
    }
}

export class BankTransactionReferences {
    AccountSvcrRef: string;
    EndToEndId?: string;

    constructor(AccountSvcrRef: string, EndToEndId?: string) {
        this.AccountSvcrRef = AccountSvcrRef;
        this.EndToEndId = EndToEndId;
    }

    static fromDto(dto: BankTransactionReferencesDTO): BankTransactionReferences {
        return new BankTransactionReferences(dto.AccountSvcrRef, dto.EndToEndId.length > 0 ? dto.EndToEndId[0] : undefined);
    }

    toDto(): BankTransactionReferencesDTO {
        return {
            AccountSvcrRef: this.AccountSvcrRef,
            EndToEndId: this.EndToEndId ? [this.EndToEndId] : [],
        };
    }
}

export class BankTransactionStructuredRemittanceInformation {
    ProperietaryCode?: string;
    Reference?: string;

    constructor(ProperietaryCode?: string, Reference?: string) {
        this.ProperietaryCode = ProperietaryCode;
        this.Reference = Reference;
    }

    static fromDto(dto: BankTransactionStructuredRemittanceInformationDTO): BankTransactionStructuredRemittanceInformation {
        return new BankTransactionStructuredRemittanceInformation(dto.ProprietaryCode.length > 0 ? dto.ProprietaryCode[0] : undefined, dto.Reference.length > 0 ? dto.Reference[0] : undefined);
    }

    toDto(): BankTransactionStructuredRemittanceInformationDTO {
        return {
            ProprietaryCode: this.ProperietaryCode ? [this.ProperietaryCode] : [],
            Reference: this.Reference ? [this.Reference] : [],
        };
    }
}


export class BankTransactionRemittanceInformation {
    TextualInformation: string;
    StructuredInformation?: BankTransactionStructuredRemittanceInformation;

    constructor(TextualInformation: string, StructuredInformation?: BankTransactionStructuredRemittanceInformation) {
        this.TextualInformation = TextualInformation;
        this.StructuredInformation = StructuredInformation;
    }

    static fromDto(dto: BankTransactionRemittanceInformationDTO): BankTransactionRemittanceInformation {
        return new BankTransactionRemittanceInformation(dto.TextualInformation,
            dto.StructuredInformation.length ? BankTransactionStructuredRemittanceInformation.fromDto(dto.StructuredInformation[0]) : undefined);
    }

    toDto(): BankTransactionRemittanceInformationDTO {
        return {
            TextualInformation: this.TextualInformation,
            StructuredInformation: this.StructuredInformation ? [
                this.StructuredInformation.toDto()
            ] : [],
        };
    }
}

export class BankTransactionDebtor {
    Name: string;
    Address: BankTransactionAddress;

    constructor(Name: string, Address: BankTransactionAddress) {
        this.Name = Name;
        this.Address = Address;
    }

    static fromDto(dto: BankTransactionDebtorDTO): BankTransactionDebtor {
        return new BankTransactionDebtor(dto.Name, BankTransactionAddress.fromDto(dto.Address));
    }

    toDto(): BankTransactionDebtorDTO {
        return {
            Name: this.Name,
            Address: this.Address.toDto()
        };
    }
}

export class BankAccountingTransaction extends AccountingTransaction {
    Type: BankTransactionType;
    Account: BankTransactionAccount;
    Counterpart?: BankTransactionCounterpart;
    CounterpartAgent?: BankTransactionCounterpartAgent;
    Debtor?: BankTransactionDebtor;
    References: BankTransactionReferences;
    RemittanceInformation: BankTransactionRemittanceInformation;
    AdditionalInfo: string[];
    DomainCode?: string;
    FamilyCode?: string;
    SubFamilyCode?: string;

    constructor(
        Type: BankTransactionType,
        Account: BankTransactionAccount,
        References: BankTransactionReferences,
        RemittanceInformation: BankTransactionRemittanceInformation,
        AdditionalInfo: string[],
        Header: AccountingTransactionHeader,
        DomainCode?: string,
        FamilyCode?: string,
        SubFamilyCode?: string,
        Counterpart?: BankTransactionCounterpart,
        CounterpartAgent?: BankTransactionCounterpartAgent,
        Debtor?: BankTransactionDebtor,
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

    static fromDto(dto: BankAccountingTransactionDTO): BankAccountingTransaction {
        return new BankAccountingTransaction(
            dto.Type,
            BankTransactionAccount.fromDto(dto.Account),
            BankTransactionReferences.fromDto(dto.References),
            BankTransactionRemittanceInformation.fromDto(dto.RemittanceInformation),
            dto.AdditionalInfo,
            AccountingTransactionHeader.fromDto(dto.Header),
            dto.DomainCode.length > 0 ? dto.DomainCode[0] : undefined,
            dto.FamilyCode.length > 0 ? dto.FamilyCode[0] : undefined,
            dto.SubFamilyCode.length > 0 ? dto.SubFamilyCode[0] : undefined,
            dto.Counterpart.length > 0 && dto.Counterpart[0] ? BankTransactionCounterpart.fromDto(dto.Counterpart[0]) : undefined,
            dto.CounterpartAgent.length > 0 && dto.CounterpartAgent[0] ? BankTransactionCounterpartAgent.fromDto(dto.CounterpartAgent[0]) : undefined,
            dto.Debtor.length > 0 && dto.Debtor[0] ? BankTransactionDebtor.fromDto(dto.Debtor[0]) : undefined
        );
    }

    toDto(): BankAccountingTransactionDTO {
        return {
            Type: this.Type,
            Account: this.Account.toDto(),
            Counterpart: this.Counterpart ? [this.Counterpart.toDto()] : [],
            CounterpartAgent: this.CounterpartAgent ? [this.CounterpartAgent.toDto()] : [],
            Debtor: this.Debtor ? [this.Debtor.toDto()] : [],
            References: this.References.toDto(),
            RemittanceInformation: this.RemittanceInformation.toDto(),
            AdditionalInfo: this.AdditionalInfo,
            Header: this.Header.toDto(),
            DomainCode: this.DomainCode ? [this.DomainCode] : [],
            FamilyCode: this.FamilyCode ? [this.FamilyCode] : [],
            SubFamilyCode: this.SubFamilyCode ? [this.SubFamilyCode] : [],
        };
    }
}
