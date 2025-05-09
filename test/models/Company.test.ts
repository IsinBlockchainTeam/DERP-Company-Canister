import { Company, CreateCompanyDTO } from '../../src/models/types/Company';

describe('Company', () => {
  describe('constructor', () => {
    it('should create a Company instance with all properties set', () => {
      // Arrange
      const name = 'DERP Company';
      const address = '123 Main St';
      const city = 'Tech City';
      const country = 'Techland';
      const phone = '+1234567890';
      const email = 'info@derpcompany.com';
      const website = 'https://derpcompany.com';
      const logo = 'logo.png';
      const vat = 'VAT123456';
      const registrationNumber = 'REG123456';
      const bank = 'Tech Bank';
      const iban = 'CH123456789';
      const bic = 'TECHBIC123';
      const swift = 'TECHSWIFT';
      const currency = 'CHF';

      // Act
      const company = new Company(
        name, address, city, country, phone, email, website, 
        logo, vat, registrationNumber, bank, iban, bic, swift, currency
      );

      // Assert
      expect(company.name).toBe(name);
      expect(company.address).toBe(address);
      expect(company.city).toBe(city);
      expect(company.country).toBe(country);
      expect(company.phone).toBe(phone);
      expect(company.email).toBe(email);
      expect(company.website).toBe(website);
      expect(company.logo).toBe(logo);
      expect(company.vat).toBe(vat);
      expect(company.registrationNumber).toBe(registrationNumber);
      expect(company.bank).toBe(bank);
      expect(company.iban).toBe(iban);
      expect(company.bic).toBe(bic);
      expect(company.swift).toBe(swift);
      expect(company.currency).toBe(currency);
    });
  });

  describe('fromDTO', () => {
    it('should create a Company instance from a DTO', () => {
      // Arrange
      const dto: CreateCompanyDTO = {
        name: 'DERP Company',
        address: '123 Main St',
        city: 'Tech City',
        country: 'Techland',
        phone: '+1234567890',
        email: 'info@derpcompany.com',
        website: 'https://derpcompany.com',
        logo: 'logo.png',
        vat: 'VAT123456',
        registrationNumber: 'REG123456',
        bank: 'Tech Bank',
        iban: 'CH123456789',
        bic: 'TECHBIC123',
        swift: 'TECHSWIFT',
        currency: 'CHF'
      };

      // Act
      const company = Company.fromDTO(dto);

      // Assert
      expect(company).toBeInstanceOf(Company);
      expect(company.name).toBe(dto.name);
      expect(company.address).toBe(dto.address);
      expect(company.city).toBe(dto.city);
      expect(company.country).toBe(dto.country);
      expect(company.phone).toBe(dto.phone);
      expect(company.email).toBe(dto.email);
      expect(company.website).toBe(dto.website);
      expect(company.logo).toBe(dto.logo);
      expect(company.vat).toBe(dto.vat);
      expect(company.registrationNumber).toBe(dto.registrationNumber);
      expect(company.bank).toBe(dto.bank);
      expect(company.iban).toBe(dto.iban);
      expect(company.bic).toBe(dto.bic);
      expect(company.swift).toBe(dto.swift);
      expect(company.currency).toBe(dto.currency);
    });
  });
}); 