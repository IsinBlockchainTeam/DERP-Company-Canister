


export class Company {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    vat: string;
    registrationNumber: string;
    bank: string;
    iban: string;
    bic: string;
    swift: string;
    currency: string;

    constructor(name: string, address: string, city: string, country: string, phone: string, email: string, website: string, logo: string, vat: string, registrationNumber: string, bank: string, iban: string, bic: string, swift: string, currency: string) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.country = country;
        this.phone = phone;
        this.email = email;
        this.website = website;
        this.logo = logo;
        this.vat = vat;
        this.registrationNumber = registrationNumber;
        this.bank = bank;
        this.iban = iban;
        this.bic = bic;
        this.swift = swift;
        this.currency = currency;
    }

    static fromDTO(dto: CreateCompanyDTO): Company {
        return new Company(dto.name, dto.address, dto.city, dto.country, dto.phone, dto.email, dto.website, dto.logo, dto.vat, dto.registrationNumber, dto.bank, dto.iban, dto.bic, dto.swift, dto.currency);
    }

}

export type CreateCompanyDTO = {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    vat: string;
    registrationNumber: string;
    bank: string;
    iban: string;
    bic: string;
    swift: string;
    currency: string;
}