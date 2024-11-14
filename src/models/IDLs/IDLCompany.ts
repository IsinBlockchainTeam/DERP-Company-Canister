import {IDL} from "azle";


export const IDLCompany = IDL.Record({
    name: IDL.Text,
    address: IDL.Text,
    city: IDL.Text,
    country: IDL.Text,
    phone: IDL.Text,
    email: IDL.Text,
    website: IDL.Text,
    logo: IDL.Text,
    vat: IDL.Text,
    registrationNumber: IDL.Text,
    bank: IDL.Text,
    iban: IDL.Text,
    bic: IDL.Text,
    swift: IDL.Text,
    currency: IDL.Text,
});

export const IDLCreateCompany = IDL.Record({
    name: IDL.Text,
    address: IDL.Text,
    city: IDL.Text,
    country: IDL.Text,
    phone: IDL.Text,
    email: IDL.Text,
    website: IDL.Text,
    logo: IDL.Text,
    vat: IDL.Text,
    registrationNumber: IDL.Text,
    bank: IDL.Text,
    iban: IDL.Text,
    bic: IDL.Text,
    swift: IDL.Text,
    currency: IDL.Text,
});