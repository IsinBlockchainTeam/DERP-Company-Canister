import { InvoiceAccountingTransaction } from "../../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleHandler } from "./DispatchRuleHandler";

export abstract class BaseInvoiceDispatchRuleHandler<R extends DispatchRule> extends DispatchRuleHandler<R, InvoiceAccountingTransaction> {
  public getContributions(rule: R, trx: InvoiceAccountingTransaction): number {
    // For invoice transactions, we'll use the TotalInclTax from the Totals
    return trx.Totals.TotalInclTax || 0;
  }
}
