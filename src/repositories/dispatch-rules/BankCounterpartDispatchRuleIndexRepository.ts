import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class BankCounterpartDispatchRuleIndexRepository {
    private static _instance: BankCounterpartDispatchRuleIndexRepository;

    // Counterpart name -> dispatch rule ID
    private _dispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.BankCounterpartDispatchRuleIndex);

    static get instance() {
        if (!BankCounterpartDispatchRuleIndexRepository._instance) {
            BankCounterpartDispatchRuleIndexRepository._instance = new BankCounterpartDispatchRuleIndexRepository();
        }
        return BankCounterpartDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToCounterpart(counterpartName: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(counterpartName) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._dispatchRuleIDs.insert(counterpartName, ruleIds);
        }
    }

    removeRuleIdFromCounterpart(counterpartName: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(counterpartName) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._dispatchRuleIDs.insert(counterpartName, ruleIds);
        }
    }

    saveRulesForCounterpart(counterpartName: string, ruleIds: number[]) {
        this._dispatchRuleIDs.insert(counterpartName, ruleIds);
    }

    getDispatchRuleIdsForCounterpart(counterpartName: string): number[] {
        return this._dispatchRuleIDs.get(counterpartName) || [];
    }
} 