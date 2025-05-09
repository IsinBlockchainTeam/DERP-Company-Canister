// @ts-ignore These imports are resolved by Jest
import { BaseAccountingTransactionRepository } from '../../src/repositories/AccountingTransactionRepository';
import { AccountingTransaction, AccountingTransactionHeader, AccountingTransactionSource, AccountingTransactionStatus, AccountingTransactionType, CustomDate } from '../../src/models/types/accounting-transaction/AccountingTransaction';
import { stableJson } from '../__mocks__/azle';

// Set up Jest to use the mocked azle module from __mocks__
jest.mock('azle');

// Simple implementation for testing that maintains state
class TestRepo extends BaseAccountingTransactionRepository<AccountingTransaction> {
  constructor() {
    // Pass a basic mock object that satisfies the Serializable interface
    const mockSerializer = stableJson;
    super(1, 2, mockSerializer as any);
  }
  
  // Helper method to create test transactions
  createTestTransaction(id: string, date: Date): AccountingTransaction {
    const header = new AccountingTransactionHeader(
      id,
      100,
      AccountingTransactionSource.ERP,
      1,
      AccountingTransactionType.INVOICE,
      'Test',
      `REF-${id}`,
      date,
      date,
      'EUR',
      AccountingTransactionStatus.NOT_ACCOUNTED,
      null,
      null,
      'Test transaction'
    );
    
    return {
      Header: header,
      toDto: () => ({ Header: header.toDto() })
    } as AccountingTransaction;
  }
}

describe('AccountingTransactionRepository Tests', () => {
  let repo: TestRepo;
  
  beforeEach(() => {
    jest.clearAllMocks();
    repo = new TestRepo();
  });

  test('can be instantiated', () => {
    expect(repo).toBeDefined();
  });

  test('get returns null for non-existent id', () => {
    const result = repo.get('test-id');
    expect(result).toBeNull();
  });

  test('save stores a transaction and can be retrieved', () => {
    const transaction = repo.createTestTransaction('123', new Date('2023-01-01'));
    
    // Save the transaction
    repo.save(transaction);
    
    // Should be able to retrieve it
    const retrieved = repo.get('123');
    expect(retrieved).toBeDefined();
    expect(retrieved?.Header.DLTERPId).toBe('123');
  });
  
  test('save updates the date index', () => {
    const transaction = repo.createTestTransaction('123', new Date('2023-01-01'));
    
    // Save the transaction
    repo.save(transaction);
    
    // List all transactions (should include our saved one)
    const all = repo.list();
    expect(all).toContain('123');
  });

  test('list returns all transaction IDs when no date range is provided', () => {
    // Save multiple transactions with different dates
    const tx1 = repo.createTestTransaction('123', new Date('2023-01-01'));
    const tx2 = repo.createTestTransaction('456', new Date('2023-01-02'));
    const tx3 = repo.createTestTransaction('789', new Date('2023-01-03'));
    
    repo.save(tx1);
    repo.save(tx2);
    repo.save(tx3);
    
    // Should return all transactions
    const allIds = repo.list();
    expect(allIds).toContain('123');
    expect(allIds).toContain('456');
    expect(allIds).toContain('789');
    expect(allIds.length).toBe(3);
  });
  
  test('list filters transactions by date range', () => {
    // Save multiple transactions with different dates
    const tx1 = repo.createTestTransaction('123', new Date('2023-01-01'));
    const tx2 = repo.createTestTransaction('456', new Date('2023-01-02'));
    const tx3 = repo.createTestTransaction('789', new Date('2023-01-03'));
    
    repo.save(tx1);
    repo.save(tx2);
    repo.save(tx3);
    
    // Filter by date range - should only include transactions from Jan 1-2
    const filtered = repo.list(new Date('2023-01-01'), new Date('2023-01-02'));
    
    expect(filtered).toContain('123');
    expect(filtered).toContain('456');
    expect(filtered).not.toContain('789');
    expect(filtered.length).toBe(2);
  });
  
  test('list with only start date returns transactions from that date onward', () => {
    // Save multiple transactions with different dates
    const tx1 = repo.createTestTransaction('123', new Date('2023-01-01'));
    const tx2 = repo.createTestTransaction('456', new Date('2023-01-02'));
    const tx3 = repo.createTestTransaction('789', new Date('2023-01-03'));
    
    repo.save(tx1);
    repo.save(tx2);
    repo.save(tx3);
    
    // Only specify start date - should include transactions from Jan 2 onward
    const filtered = repo.list(new Date('2023-01-02'));
    
    expect(filtered).not.toContain('123');
    expect(filtered).toContain('456');
    expect(filtered).toContain('789');
  });
}); 