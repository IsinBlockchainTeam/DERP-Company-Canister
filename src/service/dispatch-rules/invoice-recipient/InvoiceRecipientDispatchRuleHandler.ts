import { InvoiceAccountingTransaction } from "../../../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { RecipientDispatchRule } from "../../../models/types/dispatch-rules/invoice/RecipientDispatchRule";
import { BaseInvoiceDispatchRuleHandler } from "../BaseInvoiceDispatchRuleHandler";

/**
 * Handler for Invoice Recipient dispatch rules.
 * 
 * This handler checks if an invoice transaction's buyer matches the recipient in the dispatch rule.
 * Matching can be done by ID, name, or both if provided.
 */
export class InvoiceRecipientDispatchRuleHandler extends BaseInvoiceDispatchRuleHandler<RecipientDispatchRule> {
    /**
     * Checks if the rule applies to the transaction by comparing buyer details with the recipient reference.
     * 
     * @param rule - The RecipientDispatchRule to check against.
     * @param trx - The InvoiceAccountingTransaction to check.
     * @returns True if the transaction's buyer matches the rule's recipient reference criteria.
     */
    assert(rule: RecipientDispatchRule, trx: InvoiceAccountingTransaction): boolean {
        // No match if transaction has no buyer information
        if (!trx.Buyer) {
            return false;
        }

        const recipientRef = rule.recipientReference;
        
        // If rule specifies an ID, check if it matches the buyer's ID
        if (recipientRef.id && trx.Buyer.ID) {
            return recipientRef.id === trx.Buyer.ID;
        }
        
        // If rule specifies a name, check if it matches the buyer's name
        if (recipientRef.name && trx.Buyer.Name) {
            return recipientRef.name === trx.Buyer.Name;
        }
        
        // If we reach here, either the rule or transaction is missing matching fields
        return false;
    }
} 