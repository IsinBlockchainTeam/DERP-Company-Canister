import { IDL } from "azle";
import { IDLAccountingTransactionHeader } from "./IDLAccountingTransaction";

export const IDLBankAccountingTransactionAddress = IDL.Record({
    AddressLines: IDL.Opt(IDL.Vec(IDL.Text)),
    StreetName: IDL.Opt(IDL.Text),
    BuildingNumber: IDL.Opt(IDL.Text),
    PostCode: IDL.Opt(IDL.Text),
    TownName: IDL.Opt(IDL.Text),
    Country: IDL.Opt(IDL.Text),
});

export const IDLBankAccountingTransactionAccount = IDL.Record({
    IBAN: IDL.Text,
    Owner: IDL.Opt(IDL.Text),
    FinancialInstitutionId: IDL.Opt(IDL.Text),
});

export const IDLBankAccountingTransactionCounterpart = IDL.Record({
    Name: IDL.Text,
    Account: IDLBankAccountingTransactionAccount,
    Address: IDLBankAccountingTransactionAddress,
});

export const IDLBankAccountingTransactionCounterpartAgent = IDL.Record({
    Name: IDL.Text,
    BICFI: IDL.Text,
    Address: IDLBankAccountingTransactionAddress,
});

export const IDLBankAccountingTransactionReferences = IDL.Record({
    AccountSvcrRef: IDL.Text,
    EndToEndId: IDL.Opt(IDL.Text),
});

export const IDLBankAccountingTransactionStructuredRemittanceInformation = IDL.Record({
    ProprietaryCode: IDL.Opt(IDL.Text),
    Reference: IDL.Opt(IDL.Text),
});

export const IDLBankAccountingTransactionRemittanceInformation = IDL.Record({
    TextualInformation: IDL.Text,
    StructuredInformation: IDL.Opt(IDLBankAccountingTransactionStructuredRemittanceInformation),
});

export const IDLBankAccountingTransactionDebtor = IDL.Record({
    Name: IDL.Text,
    Address: IDLBankAccountingTransactionAddress,
});

export const IDLBankAccountingTransaction = IDL.Record({
    Type: IDL.Text,
    Account: IDLBankAccountingTransactionAccount,
    Counterpart: IDL.Opt(IDLBankAccountingTransactionCounterpart),
    CounterpartAgent: IDL.Opt(IDLBankAccountingTransactionCounterpartAgent),
    Debtor: IDL.Opt(IDLBankAccountingTransactionDebtor),
    References: IDLBankAccountingTransactionReferences,
    RemittanceInformation: IDLBankAccountingTransactionRemittanceInformation,
    AdditionalInfo: IDL.Vec(IDL.Text),
    DomainCode: IDL.Opt(IDL.Text),
    FamilyCode: IDL.Opt(IDL.Text),
    SubFamilyCode: IDL.Opt(IDL.Text),
    Header: IDLAccountingTransactionHeader,
});
