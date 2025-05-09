import { BankAccountingTransaction } from "../../../models/types/accounting-transaction/BankAccountingTransaction";
import { CounterpartDispatchRule } from "../../../models/types/dispatch-rules/bank/CounterpartDispatchRule";
import { BaseBankDispatchRuleHandler } from "../BaseBankDispatchRuleHandler";

/**
 * Handler for Bank Counterpart dispatch rules.
 * 
 * This handler checks if a bank transaction's counterpart name matches the counterpart name in the dispatch rule.
 */
export class BankCounterpartDispatchRuleHandler extends BaseBankDispatchRuleHandler<CounterpartDispatchRule> {
    /**
     * Checks if the rule applies to the transaction by comparing counterpart names.
     * 
     * @param rule - The CounterpartDispatchRule to check against.
     * @param trx - The BankAccountingTransaction to check.
     * @returns True if the transaction's counterpart name matches the rule's counterpart name, false otherwise.
     */
    assert(rule: CounterpartDispatchRule, trx: BankAccountingTransaction): boolean {
        // Check if counterpart name of the transaction matches the counterpart name in the rule
        return trx.Counterpart?.Name === rule.counterpartName;
    }
} 