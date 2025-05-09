import { Serializable, StableBTreeMap, stableJson } from "azle";
import { AccountingTransaction, CustomDate } from "../models/types/accounting-transaction/AccountingTransaction";
import { StableBTreeMapType } from "../models/types/common";

export abstract class BaseAccountingTransactionRepository<T extends AccountingTransaction> {
  protected transactions: StableBTreeMapType<string, T>;
  protected dateIndex: StableBTreeMapType<CustomDate, string[]>;

  protected constructor(
    transactionsMapId: number,
    dateIndexMapId: number,
    transactionSerializer: Serializable,
  ) {
    this.transactions = StableBTreeMap<string, T>(transactionsMapId, stableJson, transactionSerializer);
    this.dateIndex = StableBTreeMap<CustomDate, string[]>(dateIndexMapId, stableJson, stableJson);
  }

  save(transaction: T): void {
    const id = transaction.Header.DLTERPId!;
    this.transactions.insert(id, transaction);

    const issueDate = transaction.Header.IssueDate;
    if (issueDate) {
      const date = CustomDate.fromDate(issueDate);
      const indices = this.dateIndex.get(date) || [];
      this.dateIndex.insert(date, [...indices, id]);
    }
  }

  list(dateFrom?: Date, dateTo?: Date): string[] {
    const indices: string[] = [];

    if (dateFrom) {
      if (!dateTo) dateTo = new Date();
    
      const dayFrom = CustomDate.fromDate(dateFrom);
      const dayTo = CustomDate.fromDate(dateTo);
      
      // Fix for infinite loop - precompute all dates we need to check
      const datesToCheck: CustomDate[] = [];
      
      // Create a utility function to compare dates
      const compareCustomDates = (a: CustomDate, b: CustomDate): number => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
      };
      
      // Generate all dates between dayFrom and dayTo
      const currentDate = new Date(dayFrom.year, dayFrom.month, dayFrom.day);
      const endDate = new Date(dayTo.year, dayTo.month, dayTo.day);
      
      while (currentDate <= endDate) {
        datesToCheck.push({
          year: currentDate.getFullYear(),
          month: currentDate.getMonth(),
          day: currentDate.getDate()
        });
        
        // Manually increment to next day to avoid any issues with Date handling
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Get transactions for each day
      for (const date of datesToCheck) {
        const transactionsForDate = this.dateIndex.get(date) || [];
        indices.push(...transactionsForDate);
      }
    } else {
      this.dateIndex.keys().forEach(date => {
        indices.push(...(this.dateIndex.get(date) || []));
      });
    }

    return indices;
  }

  get(id: string): T | null {
    return this.transactions.get(id) || null;
  }
}
