import { AccountingTransaction } from "../../models/types/accounting-transaction/AccountingTransaction";
import { AccountingOperation } from "../../models/types/dispatch-rules/AccountingOperation";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";

/**
 * Base class for all dispatch rule handlers.
 * 
 * A dispatch rule handler is responsible for asserting if a rule applies to a given transaction and for computing the contributions of a transaction to a rule.
 */
export abstract class DispatchRuleHandler<
    R extends DispatchRule,
    A extends AccountingTransaction, 
> {
    /**
     * Assert if a rule applies to a given transaction.
     * Must be implemented by all subclasses.
     * 
     * @param rule - The rule to assert.
     * @param trx - The transaction to assert the rule against.
     * @returns True if the rule applies to the transaction, false otherwise.
     */
    protected abstract assert(rule: R, trx: A): boolean;
    
    /**
     * Get the contributions of a rule for a given transaction.
     * Must be implemented by all subclasses.
     * 
     * @param rule - The rule to get the contributions for.
     * @param trx - The transaction to get the contributions for.
     * @returns The contributions of the rule for the transaction.
     */
    protected abstract getContributions(rule: R, trx: A): number;
    
    
    /**
     * Assert if a rule applies to a given transaction.
     * Also checks if the rule is valid for the date of the given transaction for all type of rules.
     *
     * @param rule - The rule to assert.
     * @param trx - The transaction to assert the rule against.
     * @returns True if the rule applies to the transaction, false otherwise.
     */
    assertTrxActivation(rule: R, trx: A): boolean {
        const date = trx.Header.IssueDate;
        if (rule.validFrom && date && date < rule.validFrom) {
            return false;
        }

        if (rule.validTo && date && date > rule.validTo) {
            return false;
        }

        return this.assert(rule, trx);
    }
    
    /**
     * Get the computed contributions of a rule for a given transaction.
     * Computed here means that the sign of the contributions is adjusted to the rule's accounting operation.
     * 
     * @param rule - The rule to compute the contributions for.
     * @param trx - The transaction to compute the contributions for.
     * @returns The computed contributions of the rule for the transaction.
     */
    getComputedContributions(rule: R, trx: A): number {
        let contributions = this.getContributions(rule, trx);

        if (rule.accountingOperation === AccountingOperation.DEBIT) {
            contributions = -contributions;
        }
        
        return contributions;
    }
}
