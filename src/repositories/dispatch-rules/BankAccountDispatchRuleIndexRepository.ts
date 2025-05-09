import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class BankAccountDispatchRuleIndexRepository {
    private static _instance: BankAccountDispatchRuleIndexRepository;

    // IBAN -> dispatch rule ID
    private _dispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.BankAccountDispatchRuleIndex);

    static get instance() {
        if (!BankAccountDispatchRuleIndexRepository._instance) {
            BankAccountDispatchRuleIndexRepository._instance = new BankAccountDispatchRuleIndexRepository();
        }
        return BankAccountDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToIBAN(iban: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(iban) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._dispatchRuleIDs.insert(iban, ruleIds);
        }
    }

    removeRuleIdFromIBAN(iban: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(iban) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._dispatchRuleIDs.insert(iban, ruleIds);
        }
    }

    saveRulesForIBAN(iban: string, ruleIds: number[]) {
        this._dispatchRuleIDs.insert(iban, ruleIds);
    }

    getDispatchRuleIdsForIBAN(iban: string): number[] {
        return this._dispatchRuleIDs.get(iban) || [];
    }
}