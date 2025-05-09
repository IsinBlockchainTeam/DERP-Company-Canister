import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { StoreDispatchRule } from "../../../models/types/dispatch-rules/ticket/StoreDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { StoreDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/StoreDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class StoreDispatchRuleService extends BaseDispatchRuleService<StoreDispatchRule> {
    public readonly ruleType = DispatchRuleType.STORE;
    public readonly indexRepository: StoreDispatchRuleIndexRepository = StoreDispatchRuleIndexRepository.instance;
  
    public override onCreate(rule: StoreDispatchRule): void {
        this.indexRepository.addRuleIdToStore(rule.storeId, rule.id!);
    }

    public override onUpdate(currentRule: StoreDispatchRule, newRule: StoreDispatchRule): void {
        if (currentRule.storeId !== newRule.storeId) {
            this.indexRepository.removeRuleIdFromStore(currentRule.storeId, currentRule.id!);
            this.indexRepository.addRuleIdToStore(newRule.storeId, newRule.id!);
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.storeId.length < 1) {
            throw new Error("Store dispatch rule must have exactly one store id");
        }
    }

    public mapToConcreteRule(rule: DispatchRule): StoreDispatchRule {
        return new StoreDispatchRule(
            rule.id,
            rule.statementItemIDs,
            (rule as StoreDispatchRule).storeId,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    public listByStore(storeId: number): StoreDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsForStore(storeId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as StoreDispatchRule[];
    }
}