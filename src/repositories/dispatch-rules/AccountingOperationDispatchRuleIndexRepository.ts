import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";
import { AccountingOperation } from "../../models/types/dispatch-rules/AccountingOperation";

export class AccountingOperationDispatchRuleIndexRepository {
    private static _instance: AccountingOperationDispatchRuleIndexRepository;

    // accounting operation -> dispatch rule ID
    private _dispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.AccountingOperationDispatchRuleIndex);

    static get instance() {
        if (!AccountingOperationDispatchRuleIndexRepository._instance) {
            AccountingOperationDispatchRuleIndexRepository._instance = new AccountingOperationDispatchRuleIndexRepository();
        }
        return AccountingOperationDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToOperation(operation: AccountingOperation, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(operation) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._dispatchRuleIDs.insert(operation, ruleIds);
        }
    }

    removeRuleIdFromOperation(operation: AccountingOperation, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(operation) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._dispatchRuleIDs.insert(operation, ruleIds);
        }
    }

    saveRulesForOperation(operation: AccountingOperation, ruleIds: number[]) {
        this._dispatchRuleIDs.insert(operation, ruleIds);
    }

    getDispatchRuleIdsForOperation(operation: AccountingOperation): number[] {
        return this._dispatchRuleIDs.get(operation) || [];
    }
}
