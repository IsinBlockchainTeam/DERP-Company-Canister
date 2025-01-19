import { TicketAccountingTransaction } from "../../models/types/accounting-transaction/TicketAccountingTransaction";
import { GroupDispatchRule } from "../../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { TypeDispatchRuleHandler } from "./TypeDispatchRuleHandler";

export class GroupDispatchRuleHandler extends TypeDispatchRuleHandler<
    GroupDispatchRule,
    TicketAccountingTransaction
> {
    assert(rule: GroupDispatchRule, trx: TicketAccountingTransaction) {
        if(!super.assert(rule, trx))
            return false;

        (trx.LineItem || []).forEach(lineItem => {
            if (lineItem.ItemGroupId === rule.groupId) {
                return true;
            }
        });

        return false;
    }

    getContributions(rule: GroupDispatchRule, trx: TicketAccountingTransaction) {
        return trx.LineItem?.filter(lineItem => lineItem.ItemGroupId === rule.groupId).reduce((acc, lineItem) => acc + lineItem.TotalInclTax, 0) || 0;
    }
}
