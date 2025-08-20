import { InvoiceAccountingTransaction } from "../../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { StatementItemService } from "../StatementItemService";
import { ITrxDispatcher } from "./ITrxDispatcher";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { InvoiceRecipientDispatchRuleService } from "../dispatch-rules/invoice-recipient/InvoiceRecipientDispatchRuleService";
import { isDefined } from "../../models/types/common";
import { InvoiceIssuerDispatchRuleService } from "../dispatch-rules/invoice-issuer/InvoiceIssuerDispatchRuleService";
import { DispatchRuleServiceResolver } from "../dispatch-rules/DispatchRuleServiceResolver";
import { AccountingTransactionType } from "../../models/types/accounting-transaction/AccountingTransaction";

export class InvoiceDispatcher implements ITrxDispatcher<InvoiceAccountingTransaction> {
  dispatch(trx: InvoiceAccountingTransaction): void {
    console.log(`Processing invoice transaction ${trx.Header.DLTERPId}`);
    
    const statementItemService = new StatementItemService();

    //TODO manage this case also as a rule, at the moment if there are specified any statement item add a new record
    //without any rule
    //TODO check statement item ID exists
    if(trx.InvoiceStatementItems.length > 0){
      trx.InvoiceStatementItems.forEach((item) => {
        console.log(`There is specify a statement item. Adding transaction to statement item ${item.StatementItemId}`);

        statementItemService.addStatementItemTransaction(item.StatementItemId, trx.Header.IssueDate || new Date(), {
          amount: item.TotalExclTax,
          transactionId: trx.Header.DLTERPId || 'Error',
          txType: AccountingTransactionType.INVOICE,
          originalRuleId: undefined,
        });
      });
    }


    const recipientRule = this.getRuleForRecipient(trx);
    let senderRule = this.getRuleForSender(trx);
    
    // if no sender rule is found (i.e. I am not the sender, since my rule is there by default)
    // we need to search for a sender rule with id="*" and name="*"
    if(!senderRule) {
      senderRule = this.getWildcardSenderRule();
    }

    const rules = [recipientRule, senderRule].filter(isDefined);
    if (rules.length === 0) {
      console.log('No matching rules found, skipping transaction');
      return;
    }

    console.log(`Processing ${rules.length} total rules`);

    let totalAmount = 0;
    for (const rule of rules) {
      console.log(`Processing rule ${rule.id}`);
      
      const handler = DispatchRuleServiceResolver.handler(rule);
      if (handler.assertTrxActivation(rule, trx)) {
        console.log(`Rule ${rule.id} matches transaction`);
        
        const contributions = handler.getComputedContributions(rule, trx);
        console.log(`Rule ${rule.id} contribution: ${contributions}`);
        
        totalAmount += contributions;

        for (const statementItemId of rule.statementItemIDs) {
          console.log(`Adding transaction to statement item ${statementItemId}`);
          
          statementItemService.addStatementItemTransaction(statementItemId, trx.Header.IssueDate || new Date(), {
            amount: contributions,
            transactionId: trx.Header.DLTERPId || 'Error',
            txType: AccountingTransactionType.INVOICE,
            originalRuleId: rule.id,
          });
        }
      } else {
        console.log(`Rule ${rule.id} does not match transaction`);
      }
    }

    console.log(`Total amount after processing all rules: ${totalAmount}`);

    if (totalAmount !== 0) {
      console.error(`Transaction ${trx.Header.DLTERPId} is unbalanced by ${totalAmount}`);
      throw new Error(`The invoice ${trx.Header.DLTERPId} does not balance itself! Remaining unbalanced amount: ${totalAmount}`);
    }

    console.log(`Successfully processed invoice transaction ${trx.Header.DLTERPId}`);
  }

  private getRuleForRecipient(trx: InvoiceAccountingTransaction): DispatchRule | undefined {
    const service = new InvoiceRecipientDispatchRuleService();
    let recipientRules: DispatchRule[] = [];
    if (trx.Buyer) {
      recipientRules = [...recipientRules, ...service.listByRecipientName(trx.Buyer.Name)];
    }
    if (trx.Buyer.ID) {
      recipientRules = [...recipientRules, ...service.listByRecipientId(trx.Buyer.ID)];
    }

    return recipientRules.filter(isDefined)[0];
  }

  private getRuleForSender(trx: InvoiceAccountingTransaction): DispatchRule | undefined {
    const service = new InvoiceIssuerDispatchRuleService();
    let senderRules: DispatchRule[] = [];
    if (trx.Seller) {
      senderRules = [...senderRules, ...service.listByIssuerName(trx.Seller.Name)];
    }
    if (trx.Seller.ID) {
      senderRules = [...senderRules, ...service.listByIssuerId(trx.Seller.ID)];
    }

    return senderRules.filter(isDefined)[0];
  }
  
  private getWildcardSenderRule(): DispatchRule {
    const service = new InvoiceIssuerDispatchRuleService();
    return service.listByIssuerName('*').filter(isDefined)[0];
  }
}