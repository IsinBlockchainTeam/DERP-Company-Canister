// @ts-ignore These imports are resolved by Jest
import { StableTreeMapIds } from '../../src/repositories/Utils';
import { TicketAccountingTransactionRepository } from '../../src/repositories/TicketAccountingTransactionRepository';
import { TicketAccountingTransaction, TicketLineItem, TicketLineItemGroup, TicketTax } from '../../src/models/types/accounting-transaction/TicketAccountingTransaction';
import { AccountingTransactionHeader, AccountingTransactionLineItemTax, AccountingTransactionSource, AccountingTransactionStatus, AccountingTransactionTaxTypeCode, AccountingTransactionTotals, AccountingTransactionType, CustomDate } from '../../src/models/types/accounting-transaction/AccountingTransaction';

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

jest.mock('../../src/serializer/TicketAccountingTransactionSerializer', () => {
  return {
    TicketAccountingTransactionSerializer: jest.fn().mockImplementation(() => ({
      toBytes: jest.fn(),
      fromBytes: jest.fn()
    }))
  };
});

describe('TicketAccountingTransactionRepository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReset();
    mockInsert.mockReset();
    mockKeys.mockReset().mockReturnValue([]);
    
    // Clear singleton instance to test fresh
    // @ts-ignore
    TicketAccountingTransactionRepository._instance = undefined;
  });

  test('should be implemented as a singleton', () => {
    const instance1 = TicketAccountingTransactionRepository.instance;
    const instance2 = TicketAccountingTransactionRepository.instance;
    
    expect(instance1).toBe(instance2);
  });

  test('constructor should initialize with correct IDs and serializer', () => {
    const instance = TicketAccountingTransactionRepository.instance;
    
    // Verify StableBTreeMap was called with correct IDs
    expect(jest.mocked(require('azle').StableBTreeMap).mock.calls).toEqual([
      [StableTreeMapIds.TicketAccountingTransaction, {}, expect.any(Object)],
      [StableTreeMapIds.TicketAccountingTransactionDateIndex, {}, {}]
    ]);
  });

  test('save should store a ticket transaction and update date index', () => {
    const repo = TicketAccountingTransactionRepository.instance;
    const date = new Date('2023-01-01');
    
    const header = new AccountingTransactionHeader(
      'ticket-123',
      100,
      AccountingTransactionSource.ERP,
      1,
      AccountingTransactionType.TICKET,
      'CASHIER1',
      'POS-123',
      date,
      date,
      'EUR',
      AccountingTransactionStatus.NOT_ACCOUNTED,
      null,
      null,
      'Ticket transaction'
    );
    
    const totals = new AccountingTransactionTotals(10, 90, 100);
    
    const lineItemGroup = new TicketLineItemGroup('group-1', 'Food');
    
    const tax = new AccountingTransactionLineItemTax(10, AccountingTransactionTaxTypeCode.VAT, 10);
    
    const lineItem = new TicketLineItem(
      lineItemGroup.Id,
      'PROD-001',
      'Hamburger',
      1,
      'PC',
      90,
      100,
      90,
      tax
    );
    
    const ticketTax = new TicketTax('tax-1', 10, AccountingTransactionTaxTypeCode.VAT, 10);
    
    const transaction = new TicketAccountingTransaction(
      'OP-001',
      'ORD-001',
      [ticketTax],
      [lineItemGroup],
      [lineItem],
      null,
      null,
      header,
      totals
    );
    
    mockGet.mockReturnValueOnce([]);
    
    repo.save(transaction);
    
    expect(mockInsert).toHaveBeenNthCalledWith(1, 'ticket-123', transaction);
    expect(mockInsert).toHaveBeenNthCalledWith(2, expect.any(Object), ['ticket-123']);
  });

  test('get should retrieve a ticket transaction by ID', () => {
    const repo = TicketAccountingTransactionRepository.instance;
    const mockTransaction = {} as TicketAccountingTransaction;
    
    mockGet.mockReturnValueOnce(mockTransaction);
    
    const result = repo.get('ticket-123');
    
    expect(mockGet).toHaveBeenCalledWith('ticket-123');
    expect(result).toBe(mockTransaction);
  });

  test('get should return null for non-existent ID', () => {
    const repo = TicketAccountingTransactionRepository.instance;
    
    mockGet.mockReturnValueOnce(null);
    
    const result = repo.get('non-existent');
    
    expect(result).toBeNull();
  });

  test('list should return all transaction IDs when no date range specified', () => {
    const repo = TicketAccountingTransactionRepository.instance;
    const date1 = { year: 2023, month: 0, day: 1 };
    const date2 = { year: 2023, month: 0, day: 2 };
    
    mockKeys.mockReturnValueOnce([date1, date2]);
    mockGet.mockReturnValueOnce(['ticket-123']).mockReturnValueOnce(['ticket-456']);
    
    const result = repo.list();
    
    expect(result).toEqual(['ticket-123', 'ticket-456']);
  });

  test('list should filter transactions by date range', () => {
    const repo = TicketAccountingTransactionRepository.instance;
    
    // Create CustomDate objects for our dates
    const jan1 = CustomDate.fromDate(new Date('2023-01-01'));
    const jan2 = CustomDate.fromDate(new Date('2023-01-02'));
    
    // Set up mocks for the date lookups
    mockGet.mockImplementation((date) => {
      if (JSON.stringify(date) === JSON.stringify(jan1)) {
        return ['ticket-123'];
      }
      if (JSON.stringify(date) === JSON.stringify(jan2)) {
        return ['ticket-456'];
      }
      return [];
    });
    
    const result = repo.list(new Date('2023-01-01'), new Date('2023-01-02'));
    
    expect(result.includes('ticket-123')).toBe(true);
    expect(result.includes('ticket-456')).toBe(true);
    expect(result.length).toBe(2);
  });
}); 