import { DispatchRule, DispatchRuleDto } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { DispatchRuleRepository } from "../../repositories/dispatch-rules/DispatchRuleRepository";
import { IDispatchRuleService } from "./IDispatchRuleService";

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
            .map(rule => this.mapToConcreteRule(rule));
    }
  
    get(id: number): T | null {
        const rule = this.repository.getDispatchRule(id);
        if (rule && rule.ruleType === this.ruleType) {
            return this.mapToConcreteRule(rule);
        }
        return null;
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
        return this.mapToConcreteRule(savedRule);
    }


    private validateBaseRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (!ruleDto.statementItemIDs || ruleDto.statementItemIDs.length === 0) {
            throw new Error("Dispatch rule must have at least one statement item ID");
        }
    }

    protected abstract mapToConcreteRule(rule: DispatchRule): T;
    protected abstract instantiateRule(ruleDto: DispatchRuleDto): T;
    protected abstract validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void;
    protected abstract onCreate(rule: T): void;
    protected abstract onUpdate(currentRule: T, newRule: T): void;

} 