import { TicketAccountingTransaction } from "../../../models/types/accounting-transaction/TicketAccountingTransaction";
import { GroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { StoreDispatchRuleHandler } from "../store/StoreDispatchRuleHandler";

export class GroupDispatchRuleHandler extends StoreDispatchRuleHandler<
    GroupDispatchRule,
    TicketAccountingTransaction
> {
    assert(rule: GroupDispatchRule, trx: TicketAccountingTransaction) {
        if(!super.assert(rule, trx))
            return false;

        for (const lineItem of trx.LineItem || []) {
            if (lineItem.ItemGroupId === rule.groupId) {
                return true;
            }
        }
        (trx.LineItem || []).forEach(lineItem => {
            console.log(`Checking line item ${lineItem.ItemGroupId} :[${typeof lineItem.ItemGroupId}] against rule group ${rule.groupId} :[${typeof rule.groupId}]`);
            if (lineItem.ItemGroupId === rule.groupId) {
                return true;
            }
        });

        console.log(`No line item matched group ${rule.groupId}`);
        return false;
    }

    getContributions(rule: GroupDispatchRule, trx: TicketAccountingTransaction) {
        return trx.LineItem?.filter(lineItem => lineItem.ItemGroupId === rule.groupId).reduce((acc, lineItem) => acc + lineItem.TotalExclTax, 0) || 0;
    }
}
