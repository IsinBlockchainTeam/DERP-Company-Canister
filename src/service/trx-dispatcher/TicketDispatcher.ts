import { uuid } from "uuidv4";
import { TicketAccountingTransaction } from "../../models/types/accounting-transaction/TicketAccountingTransaction";
import { StatementItem } from "../../models/types/statement-items/StatementItem";
import { DispatchRuleServiceResolver } from "../dispatch-rules/DispatchRuleServiceResolver";
import { GroupDispatchRuleService } from "../dispatch-rules/group/GroupDispatchRuleService";
import { StatementItemService } from "../StatementItemService";
import { ITrxDispatcher } from "./ITrxDispatcher";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { AccountingTransactionType } from "../../models/types/accounting-transaction/AccountingTransaction";

export class TicketDispatcher implements ITrxDispatcher<TicketAccountingTransaction> {
    dispatch(trx: TicketAccountingTransaction): void {
        this.dispatchGroups(trx);
    }

    private dispatchGroups(trx: TicketAccountingTransaction): void {
        const svc = new GroupDispatchRuleService();
        const statementItemService = new StatementItemService();

        if (trx.LineItemGroups) {
            for (const group of trx.LineItemGroups) {
                const rules = svc.listByGroup(group.Id);
                if (rules.length === 0) {
                    // TODO: 
                    // create the statement item
                    // create the default rule for this group pointing to correct statement item
                    // set no category on statement item
                    const id = this.hashStringToInt32(uuid());
                    statementItemService.storeStatementItem(new StatementItem(
                        id,
                        group.Description,
                        trx.Header.Currency || "Unknown group",
                    ))

                    const rule = svc.create({
                        groupId: [group.Id],
                        statementItemIDs: [id],
                        ruleType: DispatchRuleType.GROUP,
                        storeId: [trx.Header.StoreId],
                        txType: [AccountingTransactionType.TICKET],
                        vatGroupId: [],
                    });

                    rules.push(rule);
                    console.log(`Created rule ${rule.id} for group ${group.Id} since no rules were found`);
                }

                for (const rule of rules) {
                    console.log(`Checking rule ${rule.id} against transaction ${trx.Header.DLTERPId} of type ${trx.Header.TypeCode}`);
                    const handler = DispatchRuleServiceResolver.handler(rule);
                    if (handler.assert(rule, trx)) {
                        console.log(`Rule ${rule.id} matches transaction ${trx.Header.DLTERPId}`);

                        const contribution = handler.getContributions(rule, trx);
                        for (const statementItemId of rule.statementItemIDs) {
                            if (!trx.Header.DLTERPId) {
                                throw new Error(`Transaction does not have an ID`);
                            }

                            if (!trx.Header.IssueDate) {
                                throw new Error(`Transaction ${trx.Header.DLTERPId} does not have an issue date`);
                            }

                            statementItemService.addTransactionContributions(statementItemId, trx.Header.IssueDate, {
                                amount: contribution,
                                transactionId: trx.Header.DLTERPId
                            });
                            console.log(`Added transaction of ${JSON.stringify(trx.Header.IssueDate)} to statement`, statementItemId)
                        }
                    } else {
                        throw new Error(`Rule ${rule.id} does not match transaction ${trx.Header.DLTERPId}, even though it was supposed to handle it`);
                    }
                }
            }
        }
    }

    private hashStringToInt32(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0; // Ensure int32 range
        }

        return hash;
    }
}
