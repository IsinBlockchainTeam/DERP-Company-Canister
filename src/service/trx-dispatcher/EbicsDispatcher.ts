import { uuid } from "uuidv4";
import { TicketAccountingTransaction } from "../../models/types/accounting-transaction/TicketAccountingTransaction";
import { StatementItem } from "../../models/types/statement-items/StatementItem";
import { DispatchRuleServiceResolver } from "../dispatch-rules/DispatchRuleServiceResolver";
import { GroupDispatchRuleService } from "../dispatch-rules/group/GroupDispatchRuleService";
import { StatementItemService } from "../StatementItemService";
import { ITrxDispatcher } from "./ITrxDispatcher";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { AccountingTransactionType } from "../../models/types/accounting-transaction/AccountingTransaction";
import { GroupDispatchRule } from "../../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { VatGroupDispatchRule } from "../../models/types/dispatch-rules/ticket/VatGroupDispatchRule";
import { VatGroupDispatchRuleService } from "../dispatch-rules/vat-group/VatGroupDispatchRuleService";
import { StoreDispatchRuleService } from "../dispatch-rules/store/StoreDispatchRuleService";
import { StoreDispatchRule } from "../../models/types/dispatch-rules/ticket/StoreDispatchRule";

export class TicketDispatcher implements ITrxDispatcher<TicketAccountingTransaction> {
    dispatch(trx: TicketAccountingTransaction): void {
        const statementItemService = new StatementItemService();

        const rules = [
            ...this.getTotalRules(trx),
            ...this.getTypeRules(trx),
        ];

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
            }

            console.log(`Rule ${rule.id} does not match transaction ${trx.Header.DLTERPId}`);
        }
        
        // TODO: aggiungere controllo che la lista delle contributions sia 0, se non lo e tiro errore.
    }

    // This will become 'getPaymentMethodRules' when we have payment methods
    private getTotalRules(trx: TicketAccountingTransaction): StoreDispatchRule[] {
        const svc = new StoreDispatchRuleService();
        const statementItemService = new StatementItemService();

        const rules: StoreDispatchRule[] = svc.listByStore(trx.Header.StoreId);
        if (rules.length === 0) {
            const id = this.hashStringToInt32(uuid());
            statementItemService.storeStatementItem(new StatementItem(
                id,
                "Total",
                trx.Header.Currency || "Unknown group",
            ))

            const rule = svc.create({
                id: undefined,
                statementItemIDs: [id],
                ruleType: DispatchRuleType.STORE,
                storeId: [trx.Header.StoreId],
                txType: [AccountingTransactionType.TICKET],
                groupId: [],
                vatGroupId: [],
            });

            rules.push(rule);
            console.log(`Created rule ${rule.id} for store ${trx.Header.StoreId} since no rules were found`);
        }

        return rules;
    }

    private getVatGroupRules(trx: TicketAccountingTransaction): VatGroupDispatchRule[] {
        const svc = new VatGroupDispatchRuleService();
        const statementItemService = new StatementItemService();

        let rules: VatGroupDispatchRule[] = [];
        if (trx.Tax) {
            for (const vatGroup of trx.Tax) {
                const thisRules = svc.listByGroup(vatGroup.Id);
                if (thisRules.length === 0) {
                    // TODO:
                    // create the statement item
                    // create the default rule for this group pointing to correct statement item
                    // set no category on statement item
                    const id = this.hashStringToInt32(uuid());
                    statementItemService.storeStatementItem(new StatementItem(
                        id,
                        vatGroup.TypeCode + " " + vatGroup.RateApplicablePercent.toFixed(2) + "%",
                        trx.Header.Currency || "Unknown group",
                    ))

                    const rule = svc.create({
                        groupId: [],
                        statementItemIDs: [id],
                        ruleType: DispatchRuleType.VAT_GROUP,
                        storeId: [trx.Header.StoreId],
                        txType: [AccountingTransactionType.TICKET],
                        vatGroupId: [vatGroup.Id],
                    });

                    thisRules.push(rule);
                    console.log(`Created rule ${rule.id} for vat group ${vatGroup.Id} since no rules were found`);
                }

                rules.push(...thisRules);
            }
        }

        return rules;
    }

    private getTypeRules(trx: TicketAccountingTransaction): GroupDispatchRule[] {
      // Cerca type + nome (ACCREDITI - nome, ADDEBITI - nome)
      // Se non lo trovi cerchi sempre type + causale
      // se non trovi nada:
      //  - crea un nuovo item e regola con type + causale non categorizzato come costi
      return false;
    }

    private hashStringToInt32(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0; // Ensure int32 range
        }

        return hash;
    }
}
