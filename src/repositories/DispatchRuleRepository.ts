import { StableBTreeMap } from "azle";
import { DispatchRule } from "../models/types/dispatch-rules/DispatchRule";
import { StableTreeMapIds } from "./Utils";

export class DispatchRuleRepository {
    private static _instance: DispatchRuleRepository;

    // id -> DispatchRule
    private _dispatchRules = StableBTreeMap<number, DispatchRule>(StableTreeMapIds.DispatchRules);

    static get instance() {
        if (!DispatchRuleRepository._instance) {
            DispatchRuleRepository._instance = new DispatchRuleRepository();
        }
        return DispatchRuleRepository._instance;
    }

    private constructor() { }

    saveDispatchRule<T extends DispatchRule>(rule: T): T {
        if ("id" in rule && typeof rule.id === "number") {
            if (!this._dispatchRules.containsKey(rule.id)) {
                throw new Error(`DispatchRule with id ${rule.id} does not exist`);
            }

            const inserted = this._dispatchRules.insert(rule.id, rule);
            return inserted as T;
        }

        const id = new Number(this._dispatchRules.len()).valueOf() + 1;
        const ruleWithId: T = { ...rule, id };

        this._dispatchRules.insert(id, ruleWithId);
        return ruleWithId;
    }

    getDispatchRule(id: number): DispatchRule | null {
        return this._dispatchRules.get(id);
    }

    getDispatchRules(): DispatchRule[] {
        return Array.from(this._dispatchRules.values());
    }

    deleteDispatchRule(id: number): void {
        this._dispatchRules.remove(id);
    }
}
