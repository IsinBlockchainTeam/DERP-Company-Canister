import { StableBTreeMap } from "azle";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { StableTreeMapIds } from "../Utils";

/**
 * DispatchRuleRepository is a singleton that stores all dispatch rules.
 * DispatchRules are stored here independently of their type.
 * <indexType>DispatchRuleIndexRepository (e.g. GroupDispatchRuleIndexRepository) classes are used to store indexed maps between a given parameter and a rule ID to optimize queries.
 */
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
        const rule = this._dispatchRules.get(id);
        if (!rule) {
            return null;
        }

        if (rule.validFrom && rule.validTo) {
            rule.validFrom = new Date(rule.validFrom);
            rule.validTo = new Date(rule.validTo);
        }
        
        return rule;
    }

    getDispatchRules(): DispatchRule[] {
        return Array.from(this._dispatchRules.values()).map(r => {
            if (r.validFrom && r.validTo) {
                r.validFrom = new Date(r.validFrom);
                r.validTo = new Date(r.validTo);
            }

            return r;
        });
    }

    deleteDispatchRule(id: number): void {
        this._dispatchRules.remove(id);
    }
}
