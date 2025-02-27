import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class StoreDispatchRuleIndexRepository {
  private static _instance: StoreDispatchRuleIndexRepository;

  // store ID -> dispatch rule ID
  private _storeDispatchRuleIDs = StableBTreeMap<number, number[]>(StableTreeMapIds.StoreDispatchRuleIndex);

  static get instance() {
    if (!StoreDispatchRuleIndexRepository._instance) {
      StoreDispatchRuleIndexRepository._instance = new StoreDispatchRuleIndexRepository();
    }
    return StoreDispatchRuleIndexRepository._instance;
  }

  private constructor() { }

  addRuleIdToStore(storeId: number, ruleId: number) {
    const ruleIds = this._storeDispatchRuleIDs.get(storeId) || [];
    if (!ruleIds.includes(ruleId)) {
      ruleIds.push(ruleId);
      this._storeDispatchRuleIDs.insert(storeId, ruleIds);
    }
  }

  removeRuleIdFromStore(storeId: number, ruleId: number) {
    const ruleIds = this._storeDispatchRuleIDs.get(storeId) || [];
    const index = ruleIds.indexOf(ruleId);
    if (index > -1) {
      ruleIds.splice(index, 1);
      this._storeDispatchRuleIDs.insert(storeId, ruleIds);
    }
  }

  saveRulesForStore(storeId: number, ruleIds: number[]) {
    this._storeDispatchRuleIDs.insert(storeId, ruleIds);
  }

  getDispatchRuleIdsForStore(storeId: number): number[] {
    return this._storeDispatchRuleIDs.get(storeId) || [];
  }
}
