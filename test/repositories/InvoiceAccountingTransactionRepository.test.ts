// @ts-ignore These imports are resolved by Jest
import { StableTreeMapIds } from '../../src/repositories/Utils';
import { InvoiceAccountingTransactionRepository } from '../../src/repositories/InvoiceAccountingTransactionRepository';
import { InvoiceAccountingTransaction, InvoiceAddress, InvoiceAttachments, InvoiceCompany, InvoiceContact, InvoiceLineItem, InvoicePaymentDetails, InvoiceTax, PaymentPayee } from '../../src/models/types/accounting-transaction/InvoiceAccountingTransaction';
import { AccountingTransactionAdditionalInfo, AccountingTransactionHeader, AccountingTransactionLineItemTax, AccountingTransactionSource, AccountingTransactionStatus, AccountingTransactionTaxTypeCode, AccountingTransactionTotals, AccountingTransactionType, CustomDate } from '../../src/models/types/accounting-transaction/AccountingTransaction';

// Mock the azle library and serializer
const mockGet = jest.fn();
const mockInsert = jest.fn();
const mockKeys = jest.fn().mockReturnValue([]);

jest.mock('azle', () => ({
  StableBTreeMap: jest.fn().mockImplementation(() => ({
    get: mockGet,
    insert: mockInsert,
    keys: mockKeys
  })),
  stableJson: {},
}));

jest.mock('../../src/serializer/InvoiceAccountingTransactionSerializer', () => {
  return {
    InvoiceAccountingTransactionSerializer: jest.fn().mockImplementation(() => ({
      toBytes: jest.fn(),
      fromBytes: jest.fn()
    }))
  };
});

describe('InvoiceAccountingTransactionRepository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReset();
    mockInsert.mockReset();
    mockKeys.mockReset().mockReturnValue([]);
    
    // Clear singleton instance to test fresh
    // @ts-ignore
    InvoiceAccountingTransactionRepository._instance = undefined;
  });

  test('should be implemented as a singleton', () => {
    const instance1 = InvoiceAccountingTransactionRepository.instance;
    const instance2 = InvoiceAccountingTransactionRepository.instance;
    
    expect(instance1).toBe(instance2);
  });

  test('constructor should initialize with correct IDs and serializer', () => {
    const instance = InvoiceAccountingTransactionRepository.instance;
    
    // Verify StableBTreeMap was called with correct IDs
    expect(jest.mocked(require('azle').StableBTreeMap).mock.calls).toEqual([
      [StableTreeMapIds.InvoiceAccountingTransaction, {}, expect.any(Object)],
      [StableTreeMapIds.InvoiceAccountingTransactionDateIndex, {}, {}]
    ]);
  });

  test('save should store an invoice transaction and update date index', () => {
    const repo = InvoiceAccountingTransactionRepository.instance;
    const date = new Date('2023-01-01');
    
    const header = new AccountingTransactionHeader(
      'invoice-123',
      1000,
      AccountingTransactionSource.ERP,
      1,
      AccountingTransactionType.INVOICE,
      'ERP',
      'INV-123',
      date,
      date,
      'EUR',
      AccountingTransactionStatus.NOT_ACCOUNTED,
      null,
      null,
      'Invoice transaction'
    );
    
    const totals = new AccountingTransactionTotals(100, 900, 1000);
    
    const sellerAddress = new InvoiceAddress('123 Seller St', '12345', 'US');
    const sellerContact = new InvoiceContact('Seller Name', 'seller@example.com', '123-456-7890');
    const seller = new InvoiceCompany('SELLER-001', 'Seller Company', sellerAddress, sellerContact);
    
    const buyerAddress = new InvoiceAddress('456 Buyer Ave', '67890', 'US');
    const buyerContact = new InvoiceContact('Buyer Name', 'buyer@example.com', '987-654-3210');
    const buyer = new InvoiceCompany('BUYER-001', 'Buyer Company', buyerAddress, buyerContact);
    
    const tax = new AccountingTransactionLineItemTax(100, AccountingTransactionTaxTypeCode.VAT, 10);
    
    const lineItem = new InvoiceLineItem(
      'PROD-001',
      'Product Description',
      1,
      'PC',
      900,
      1000,
      900,
      tax
    );
    
    const invoiceTax = new InvoiceTax(100, AccountingTransactionTaxTypeCode.VAT, 10);
    
    const payee = new PaymentPayee('Payee Name', '123 Payee St', '12345', 'Payee City', 'US');
    const payment = new InvoicePaymentDetails('IBAN123456789', 'REF-123', 'BICSWIFT', 'QR-CODE', {}, payee);
    
    const attachment = new InvoiceAttachments('invoice.pdf', 'application/pdf', 1);
    
    const additionalInfo = new AccountingTransactionAdditionalInfo('Additional notes');
    
    const transaction = new InvoiceAccountingTransaction(
      [invoiceTax],
      seller,
      buyer,
      [lineItem],
      payment,
      [attachment],
      additionalInfo,
      header,
      totals
    );
    
    mockGet.mockReturnValueOnce([]);
    
    repo.save(transaction);
    
    expect(mockInsert).toHaveBeenNthCalledWith(1, 'invoice-123', transaction);
    expect(mockInsert).toHaveBeenNthCalledWith(2, expect.any(Object), ['invoice-123']);
  });

  test('get should retrieve an invoice transaction by ID', () => {
    const repo = InvoiceAccountingTransactionRepository.instance;
    const mockTransaction = {} as InvoiceAccountingTransaction;
    
    mockGet.mockReturnValueOnce(mockTransaction);
    
    const result = repo.get('invoice-123');
    
    expect(mockGet).toHaveBeenCalledWith('invoice-123');
    expect(result).toBe(mockTransaction);
  });

  test('get should return null for non-existent ID', () => {
    const repo = InvoiceAccountingTransactionRepository.instance;
    
    mockGet.mockReturnValueOnce(null);
    
    const result = repo.get('non-existent');
    
    expect(result).toBeNull();
  });

  test('list should return all transaction IDs when no date range specified', () => {
    const repo = InvoiceAccountingTransactionRepository.instance;
    const date1 = { year: 2023, month: 0, day: 1 };
    const date2 = { year: 2023, month: 0, day: 2 };
    
    mockKeys.mockReturnValueOnce([date1, date2]);
    mockGet.mockReturnValueOnce(['invoice-123']).mockReturnValueOnce(['invoice-456']);
    
    const result = repo.list();
    
    expect(result).toEqual(['invoice-123', 'invoice-456']);
  });

  test('list should filter transactions by date range', () => {
    const repo = InvoiceAccountingTransactionRepository.instance;
    
    // Create CustomDate objects for our dates
    const jan1 = CustomDate.fromDate(new Date('2023-01-01'));
    const jan2 = CustomDate.fromDate(new Date('2023-01-02'));
    
    // Set up mocks for the date lookups
    mockGet.mockImplementation((date) => {
      if (JSON.stringify(date) === JSON.stringify(jan1)) {
        return ['invoice-123'];
      }
      if (JSON.stringify(date) === JSON.stringify(jan2)) {
        return ['invoice-456'];
      }
      return [];
    });
    
    const result = repo.list(new Date('2023-01-01'), new Date('2023-01-02'));
    
    expect(result.includes('invoice-123')).toBe(true);
    expect(result.includes('invoice-456')).toBe(true);
    expect(result.length).toBe(2);
  });
}); 