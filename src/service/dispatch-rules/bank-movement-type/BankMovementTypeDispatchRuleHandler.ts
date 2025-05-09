import { BankAccountingTransaction } from "../../../models/types/accounting-transaction/BankAccountingTransaction";
import { MovementTypeDispatchRule } from "../../../models/types/dispatch-rules/bank/MovementTypeDispatchRule";
import { BaseBankDispatchRuleHandler } from "../BaseBankDispatchRuleHandler";

export class BankMovementTypeDispatchRuleHandler extends BaseBankDispatchRuleHandler<MovementTypeDispatchRule> {
  public assert(rule: MovementTypeDispatchRule, trx: BankAccountingTransaction): boolean {
    return trx.Type === rule.movementType;
  }
} 