import { BankAccountingTransaction, BankTransactionType } from "../../models/types/accounting-transaction/BankAccountingTransaction";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleHandler } from "./DispatchRuleHandler";

export abstract class BaseBankDispatchRuleHandler<R extends DispatchRule> extends DispatchRuleHandler<R, BankAccountingTransaction> {
  public getContributions(rule: R, trx: BankAccountingTransaction): number {
    if(trx.Type === BankTransactionType.CREDIT) return trx.Header.TotalAmount || 0;
    else return -(trx.Header.TotalAmount || 0);
  }
}