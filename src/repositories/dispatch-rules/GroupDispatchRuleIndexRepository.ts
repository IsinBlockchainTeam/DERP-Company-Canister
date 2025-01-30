import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class GroupDispatchRuleIndexRepository {
    private static _instance: GroupDispatchRuleIndexRepository;

    // group ID -> dispatch rule ID
    private _dispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.GroupDispatchRuleIndex);

    static get instance() {
        if (!GroupDispatchRuleIndexRepository._instance) {
            GroupDispatchRuleIndexRepository._instance = new GroupDispatchRuleIndexRepository();
        }
        return GroupDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToGroup(groupId: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(groupId) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._dispatchRuleIDs.insert(groupId, ruleIds);
        }
    }

    removeRuleIdFromGroup(groupId: string, ruleId: number) {
        const ruleIds = this._dispatchRuleIDs.get(groupId) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._dispatchRuleIDs.insert(groupId, ruleIds);
        }
    }

    saveRulesForGroup(groupId: string, ruleIds: number[]) {
        this._dispatchRuleIDs.insert(groupId, ruleIds);
    }

    getDispatchRuleIdsForGroup(id: string): number[] {
        return this._dispatchRuleIDs.get(id) || [];
    }

}
