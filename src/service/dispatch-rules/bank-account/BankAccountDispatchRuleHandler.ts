import { BankAccountingTransaction } from "../../../models/types/accounting-transaction/BankAccountingTransaction";
import { AccountDispatchRule } from "../../../models/types/dispatch-rules/bank/AccountDispatchRule";
import { BaseBankDispatchRuleHandler } from "../BaseBankDispatchRuleHandler";

/**
 * Handler for Bank Account dispatch rules.
 * 
 * This handler checks if a bank transaction's IBAN matches the IBAN in the dispatch rule.
 */
export class BankAccountDispatchRuleHandler extends BaseBankDispatchRuleHandler<AccountDispatchRule> {
    /**
     * Checks if the rule applies to the transaction by comparing IBANs.
     * 
     * @param rule - The AccountDispatchRule to check against.
     * @param trx - The BankAccountingTransaction to check.
     * @returns True if the transaction's IBAN matches the rule's IBAN, false otherwise.
     */
    assert(rule: AccountDispatchRule, trx: BankAccountingTransaction): boolean {
        // Check if IBAN of the transaction's Account matches the IBAN in the rule
        return trx.Account.IBAN === rule.IBAN;
    }
}
