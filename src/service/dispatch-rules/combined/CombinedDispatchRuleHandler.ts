import { AccountingTransaction } from "../../../models/types/accounting-transaction/AccountingTransaction";
import { CombinedDispatchRule } from "../../../models/types/dispatch-rules/CombinedDispatchRule";
import { DispatchRule } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleHandler } from "../DispatchRuleHandler";
import { DispatchRuleServiceResolver } from "../DispatchRuleServiceResolver";

export class CombinedDispatchRuleHandler extends DispatchRuleHandler<CombinedDispatchRule, AccountingTransaction> {
    // A combined dispatch rule is valid if all its child rules are valid.
    assert(rule: CombinedDispatchRule, trx: AccountingTransaction): boolean {
        return rule.rules.every(r => DispatchRuleServiceResolver.handler(r).assert(r, trx));
    }

    // A combined dispatch rule considers only child rules with contributes=true
    getContributions(rule: CombinedDispatchRule, trx: AccountingTransaction): number {
      // If there are no contributing rules, return the total amount
      if (!rule.rules.some(r => r.contributes)) {
        return trx.Header.TotalAmount || 0;
      }
      
      // Otherwise, sum only the contributions from child rules that have contributes=true
      return rule.rules
        .filter(r => r.contributes)
        .reduce((total, r) => total + DispatchRuleServiceResolver.handler(r).getContributions(r, trx), 0);
    }
}