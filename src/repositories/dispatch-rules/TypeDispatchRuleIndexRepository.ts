import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class TypeDispatchRuleIndexRepository {
    private static _instance: TypeDispatchRuleIndexRepository;

    // group ID -> dispatch rule ID
    private _dispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.TypeDispatchRuleIndex);

    static get instance() {
        if (!TypeDispatchRuleIndexRepository._instance) {
            TypeDispatchRuleIndexRepository._instance = new TypeDispatchRuleIndexRepository();
        }
        return TypeDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToType(type: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(type) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._dispatchRuleIDs.insert(type, ruleIds);
        }
    }

    removeRuleIdFromType(type: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(type) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._dispatchRuleIDs.insert(type, ruleIds);
        }
    }

    saveRulesForType(type: string, ruleIds: number[]) {
        this._dispatchRuleIDs.insert(type, ruleIds);
    }

    getDispatchRuleIdsForType(id: string): number[] {
        return this._dispatchRuleIDs.get(id) || [];
    }
}
