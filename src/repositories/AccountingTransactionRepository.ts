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
    console.log("Listing transactions from", dateFrom, "to", dateTo);
    const indices: string[] = [];

    if (dateFrom) {
      if (!dateTo) dateTo = new Date();
    
      const dayFrom = CustomDate.fromDate(dateFrom);
      const dayTo = CustomDate.fromDate(dateTo);
      let currentDate = dayFrom;

      while (new Date(currentDate.year, currentDate.month, currentDate.day) <= new Date(dayTo.year, dayTo.month, dayTo.day)) {
        indices.push(
          ...(this.dateIndex.get(currentDate) || [])
        );
        const nextDate = new Date(currentDate.year, currentDate.month, currentDate.day + 1);
        currentDate = CustomDate.fromDate(nextDate);
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
