// @ts-ignore These imports are resolved by Jest
import { StableTreeMapIds } from '../../src/repositories/Utils';
import { BankAccountingTransactionRepository } from '../../src/repositories/BankAccountingTransactionRepository';
import { BankAccountingTransaction, BankTransactionAccount, BankTransactionReferences, BankTransactionRemittanceInformation, BankTransactionType } from '../../src/models/types/accounting-transaction/BankAccountingTransaction';
import { AccountingTransactionHeader, AccountingTransactionSource, AccountingTransactionStatus, AccountingTransactionType, CustomDate } from '../../src/models/types/accounting-transaction/AccountingTransaction';

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

jest.mock('../../src/serializer/BankAccountingTransactionSerializer', () => {
  return {
    BankAccountingTransactionSerializer: jest.fn().mockImplementation(() => ({
      toBytes: jest.fn(),
      fromBytes: jest.fn()
    }))
  };
});

describe('BankAccountingTransactionRepository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReset();
    mockInsert.mockReset();
    mockKeys.mockReset().mockReturnValue([]);
    
    // Clear singleton instance to test fresh
    // @ts-ignore
    BankAccountingTransactionRepository._instance = undefined;
  });

  test('should be implemented as a singleton', () => {
    const instance1 = BankAccountingTransactionRepository.instance;
    const instance2 = BankAccountingTransactionRepository.instance;
    
    expect(instance1).toBe(instance2);
  });

  test('constructor should initialize with correct IDs and serializer', () => {
    const instance = BankAccountingTransactionRepository.instance;
    
    // Verify StableBTreeMap was called with correct IDs
    expect(jest.mocked(require('azle').StableBTreeMap).mock.calls).toEqual([
      [StableTreeMapIds.BankAccountingTransaction, {}, expect.any(Object)],
      [StableTreeMapIds.BankAccountingTransactionDateIndex, {}, {}]
    ]);
  });

  test('save should store a bank transaction and update date index', () => {
    const repo = BankAccountingTransactionRepository.instance;
    const date = new Date('2023-01-01');
    
    const header = new AccountingTransactionHeader(
      'bank-123',
      1000,
      AccountingTransactionSource.BANK,
      1,
      AccountingTransactionType.BANK_TRX,
      'IBAN123',
      'REF-123',
      date,
      date,
      'EUR',
      AccountingTransactionStatus.NOT_ACCOUNTED,
      null,
      null,
      'Bank transaction'
    );
    
    const transaction = new BankAccountingTransaction(
      BankTransactionType.CREDIT,
      new BankTransactionAccount('IBAN123', 'Owner Name'),
      new BankTransactionReferences('REF-123'),
      new BankTransactionRemittanceInformation(),
      [],
      header
    );
    
    mockGet.mockReturnValueOnce([]);
    
    repo.save(transaction);
    
    expect(mockInsert).toHaveBeenNthCalledWith(1, 'bank-123', transaction);
    expect(mockInsert).toHaveBeenNthCalledWith(2, expect.any(Object), ['bank-123']);
  });

  test('get should retrieve a bank transaction by ID', () => {
    const repo = BankAccountingTransactionRepository.instance;
    const mockTransaction = {} as BankAccountingTransaction;
    
    mockGet.mockReturnValueOnce(mockTransaction);
    
    const result = repo.get('bank-123');
    
    expect(mockGet).toHaveBeenCalledWith('bank-123');
    expect(result).toBe(mockTransaction);
  });

  test('get should return null for non-existent ID', () => {
    const repo = BankAccountingTransactionRepository.instance;
    
    mockGet.mockReturnValueOnce(null);
    
    const result = repo.get('non-existent');
    
    expect(result).toBeNull();
  });

  test('list should return all transaction IDs when no date range specified', () => {
    const repo = BankAccountingTransactionRepository.instance;
    const date1 = { year: 2023, month: 0, day: 1 };
    const date2 = { year: 2023, month: 0, day: 2 };
    
    mockKeys.mockReturnValueOnce([date1, date2]);
    mockGet.mockReturnValueOnce(['bank-123']).mockReturnValueOnce(['bank-456']);
    
    const result = repo.list();
    
    expect(result).toEqual(['bank-123', 'bank-456']);
  });

  test('list should filter transactions by date range', () => {
    const repo = BankAccountingTransactionRepository.instance;
    
    // Create CustomDate objects for our dates
    const jan1 = CustomDate.fromDate(new Date('2023-01-01'));
    const jan2 = CustomDate.fromDate(new Date('2023-01-02'));
    
    // Set up mocks for the date lookups
    mockGet.mockImplementation((date) => {
      if (JSON.stringify(date) === JSON.stringify(jan1)) {
        return ['bank-123'];
      }
      if (JSON.stringify(date) === JSON.stringify(jan2)) {
        return ['bank-456'];
      }
      return [];
    });
    
    const result = repo.list(new Date('2023-01-01'), new Date('2023-01-02'));
    
    expect(result.includes('bank-123')).toBe(true);
    expect(result.includes('bank-456')).toBe(true);
    expect(result.length).toBe(2);
  });
}); 