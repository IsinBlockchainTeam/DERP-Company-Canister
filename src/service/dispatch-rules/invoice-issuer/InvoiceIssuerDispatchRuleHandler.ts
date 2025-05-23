import { InvoiceAccountingTransaction } from "../../../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { IssuerDispatchRule } from "../../../models/types/dispatch-rules/invoice/IssuerDispatchRule";
import { BaseInvoiceDispatchRuleHandler } from "../BaseInvoiceDispatchRuleHandler";

/**
 * Handler for Invoice Issuer dispatch rules.
 * 
 * This handler checks if an invoice transaction's seller matches the issuer in the dispatch rule.
 * Matching can be done by ID, name, or both if provided.
 */
export class InvoiceIssuerDispatchRuleHandler extends BaseInvoiceDispatchRuleHandler<IssuerDispatchRule> {
    /**
     * Checks if the rule applies to the transaction by comparing seller details with the issuer reference.
     * 
     * @param rule - The IssuerDispatchRule to check against.
     * @param trx - The InvoiceAccountingTransaction to check.
     * @returns True if the transaction's seller matches the rule's issuer reference criteria.
     */
    assert(rule: IssuerDispatchRule, trx: InvoiceAccountingTransaction): boolean {
        // No match if transaction has no seller information
        if (!trx.Seller) {
            return false;
        }

        const issuerRef = rule.issuerReference;
        
        // If rule specifies an ID, check if it matches the seller's ID
        if (issuerRef.id && trx.Seller.ID) {
            return issuerRef.id === trx.Seller.ID;
        }
        
        // If rule specifies a name, check if it matches the seller's name
        if (issuerRef.name && trx.Seller.Name) {
            return issuerRef.name === trx.Seller.Name;
        }
        
        // If we reach here, either the rule or transaction is missing matching fields
        return false;
    }
} 