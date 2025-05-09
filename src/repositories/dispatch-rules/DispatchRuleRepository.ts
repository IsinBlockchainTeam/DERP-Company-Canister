import { StableBTreeMap } from "azle";
import { DispatchRule, DispatchRuleDto } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleEntityMapper } from "../../service/DispatchRuleEntityMapper";
import { StableTreeMapIds } from "../Utils";

/**
 * DispatchRuleRepository is a singleton that stores all dispatch rules.
 * DispatchRules are stored here independently of their type.
 * <indexType>DispatchRuleIndexRepository (e.g. GroupDispatchRuleIndexRepository) classes are used to store indexed maps between a given parameter and a rule ID to optimize queries.
 */
export class DispatchRuleRepository {
    private static _instance: DispatchRuleRepository;

    // id -> DispatchRule
    private _dispatchRules = StableBTreeMap<number, DispatchRuleDto>(StableTreeMapIds.DispatchRules);

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

            this._dispatchRules.insert(rule.id, rule.toDto());
            return rule;
        }

        const id = new Number(this._dispatchRules.len()).valueOf() + 1;
        rule.id = id;

        const dto = rule.toDto();
        this._dispatchRules.insert(id, dto);
        return DispatchRuleEntityMapper.fromDto(dto) as T;
    }

    getDispatchRule(id: number): DispatchRule | null {
        const rule = this._dispatchRules.get(id);
        if (!rule) {
            return null;
        }
        
        return DispatchRuleEntityMapper.fromDto(rule);
    }

    getDispatchRules(): DispatchRule[] {
        return Array.from(this._dispatchRules.values()).map(r => {
            return DispatchRuleEntityMapper.fromDto(r);
        });
    }

    deleteDispatchRule(id: number): void {
        this._dispatchRules.remove(id);
    }
}
