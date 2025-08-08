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
      console.log(`Saving transaction with ID: ${id} and issue date: ${issueDate}`);
      const date = CustomDate.fromDate(issueDate);
      const indices = this.dateIndex.get(date) || [];
      this.dateIndex.insert(date, [...indices, id]);
    }
    //TODO if not issueData use now date or some other logic
  }

  list(dateFrom?: Date, dateTo?: Date): string[] {
    const indices: string[] = [];

    if (dateFrom) {
      if (!dateTo) dateTo = new Date();
    
      const dayFrom = CustomDate.fromDate(dateFrom);
      const dayTo = CustomDate.fromDate(dateTo);
      
      // Generate all dates between dayFrom and dayTo
      const currentDate = new Date(dayFrom.year, dayFrom.month, dayFrom.day);
      const endDate = new Date(dayTo.year, dayTo.month, dayTo.day);
      
      while (currentDate <= endDate) {
        indices.push(...(this.dateIndex.get(CustomDate.fromDate(currentDate)) || []));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
    } else {
      console.log("Listing all transactions without date filter");
      this.dateIndex.keys().forEach(date => {
        console.log(`Processing date: ${date.year}-${date.month + 1}-${date.day}`);
        indices.push(...(this.dateIndex.get(date) || []));
      });
    }

    return indices;
  }

  get(id: string): T | null {
    return this.transactions.get(id) || null;
  }
}
