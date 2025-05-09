import { DispatchRule, DispatchRuleDto } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { DispatchRuleRepository } from "../../repositories/dispatch-rules/DispatchRuleRepository";
import { IDispatchRuleService } from "./IDispatchRuleService";
import { DispatchRuleEntityMapper } from "../DispatchRuleEntityMapper";

export abstract class BaseDispatchRuleService<T extends DispatchRule> implements IDispatchRuleService<T> {
    protected readonly repository: DispatchRuleRepository = DispatchRuleRepository.instance;
    protected abstract readonly ruleType: DispatchRuleType;

    create(ruleDto: DispatchRuleDto): T {
        this.validateBaseRuleDto(ruleDto);
        this.validateRuleDto(ruleDto);
        const rule = this.instantiateRule(ruleDto);
        const saved = this.saveRule(rule);
        this.onCreate(saved);

        return saved;
    }


    list(): T[] {
        return this.repository.getDispatchRules()
            .filter(rule => rule.ruleType === this.ruleType)
            .map(rule => rule as T);
    }
  
    get(id: number): T | null {
        const rule = this.repository.getDispatchRule(id);
        return rule as T | null;
    }

    update(ruleDto: DispatchRuleDto): T {
        this.validateBaseRuleDto(ruleDto);
        this.validateRuleDto(ruleDto);

        const currentRule = this.get(ruleDto.id!);
        if (!currentRule) {
            throw new Error(`Rule with id ${ruleDto.id} not found`);
        }

        const newRule = this.instantiateRule(ruleDto);
        const saved = this.saveRule(newRule);

        this.onUpdate(currentRule, saved);
        return saved;
    }


    protected saveRule(rule: T): T {
        const savedRule = this.repository.saveDispatchRule<T>(rule);
        if (!savedRule.id) {
            throw new Error("Failed to save dispatch rule");
        }

        return savedRule;
    }

    
    protected instantiateRule(ruleDto: DispatchRuleDto): T {
        return DispatchRuleEntityMapper.fromDto(ruleDto) as T;
    }


    abstract validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void;
    abstract onCreate(rule: T): void;
    abstract onUpdate(currentRule: T, newRule: T): void;

    private validateBaseRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (!ruleDto.statementItemIDs || ruleDto.statementItemIDs.length === 0) {
            throw new Error("Dispatch rule must have at least one statement item ID");
        }
    }
} 