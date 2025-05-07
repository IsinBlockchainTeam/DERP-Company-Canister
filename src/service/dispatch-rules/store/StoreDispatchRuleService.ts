import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { StoreDispatchRule } from "../../../models/types/dispatch-rules/ticket/StoreDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { StoreDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/StoreDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class StoreDispatchRuleService extends BaseDispatchRuleService<StoreDispatchRule> {
    protected readonly ruleType = DispatchRuleType.STORE;
    protected readonly indexRepository: StoreDispatchRuleIndexRepository = StoreDispatchRuleIndexRepository.instance;
  
    protected override onCreate(rule: StoreDispatchRule): void {
        this.indexRepository.addRuleIdToStore(rule.storeId, rule.id!);
    }

    protected override onUpdate(currentRule: StoreDispatchRule, newRule: StoreDispatchRule): void {
        if (currentRule.storeId !== newRule.storeId) {
            this.indexRepository.removeRuleIdFromStore(currentRule.storeId, currentRule.id!);
            this.indexRepository.addRuleIdToStore(newRule.storeId, newRule.id!);
        }
    }

    protected instantiateRule(ruleDto: DispatchRuleDto): StoreDispatchRule {
        return new StoreDispatchRule(
            undefined,
            ruleDto.statementItemIDs,
            ruleDto.storeId[0]!,
            ruleDto.accountingOperation,
            ruleDto.validFrom[0] ? new Date(ruleDto.validFrom[0]) : undefined,
            ruleDto.validTo[0] ? new Date(ruleDto.validTo[0]) : undefined
        );
    }

    protected validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.storeId.length < 1) {
            throw new Error("Store dispatch rule must have exactly one store id");
        }
    }

    protected mapToConcreteRule(rule: DispatchRule): StoreDispatchRule {
        return new StoreDispatchRule(
            rule.id,
            rule.statementItemIDs,
            (rule as StoreDispatchRule).storeId,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    listByStore(storeId: number): StoreDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsForStore(storeId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as StoreDispatchRule[];
    }

}