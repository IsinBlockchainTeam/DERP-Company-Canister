import { BankAccountingTransaction } from "../../../models/types/accounting-transaction/BankAccountingTransaction";
import { CausalDispatchRule } from "../../../models/types/dispatch-rules/bank/CausalDispatchRule";
import { BaseBankDispatchRuleHandler } from "../BaseBankDispatchRuleHandler";

/**
 * Handler for Bank Causal dispatch rules.
 * 
 * This handler checks if a bank transaction's causal codes match the causal codes in the dispatch rule.
 */
export class BankCausalDispatchRuleHandler extends BaseBankDispatchRuleHandler<CausalDispatchRule> {
    /**
     * Checks if the rule applies to the transaction by comparing domain, family, and subfamily codes.
     * 
     * @param rule - The CausalDispatchRule to check against.
     * @param trx - The BankAccountingTransaction to check.
     * @returns True if the transaction's causal codes match the rule's causal codes, false otherwise.
     */
    assert(rule: CausalDispatchRule, trx: BankAccountingTransaction): boolean {
        // Check if causal codes of the transaction match the causal codes in the rule
        return (
            trx.DomainCode === rule.domainCode &&
            trx.FamilyCode === rule.familyCode &&
            trx.SubFamilyCode === rule.subFamilyCode
        );
    }
} 