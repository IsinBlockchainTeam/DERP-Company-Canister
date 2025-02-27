import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { StoreDispatchRule } from "../../../models/types/dispatch-rules/ticket/StoreDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";
import { StoreDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/StoreDispatchRuleIndexRepository";

export class StoreDispatchRuleService implements IDispatchRuleService<StoreDispatchRule> {
  private readonly repository: DispatchRuleRepository = DispatchRuleRepository.instance;
  private readonly storeBasedRepository: StoreDispatchRuleIndexRepository = StoreDispatchRuleIndexRepository.instance;

  create(ruleDto: DispatchRuleDto): StoreDispatchRule {
    // check rule request
    if(ruleDto.storeId.length < 1) {
      throw new Error("Store dispatch rule must have exactly one store id");
    }

    const storeId = ruleDto.storeId[0]!;
    const statementItemIds = ruleDto.statementItemIDs;

    const rule = new StoreDispatchRule(
      undefined,
      statementItemIds,
      storeId,
      DispatchRuleType.STORE
    )

    const savedRule = this.repository.saveDispatchRule<StoreDispatchRule>(rule);
    if (!savedRule.id) {
      throw new Error("Failed to save dispatch rule");
    }

    this.storeBasedRepository.addRuleIdToStore(storeId, savedRule.id);
    return new StoreDispatchRule(savedRule.id, savedRule.statementItemIDs, savedRule.storeId);
  }

  update(ruleDto: DispatchRuleDto): StoreDispatchRule {
    if (!("id" in ruleDto)) {
      throw new Error("Dispatch rule to be updated must have an id");
    }

    const rule = new StoreDispatchRule(
      ruleDto.id,
      ruleDto.statementItemIDs,
      ruleDto.storeId[0]!,
      DispatchRuleType.STORE
    )
    
    const currentRule = this.repository.getDispatchRule(ruleDto.id!) as StoreDispatchRule;
    if (currentRule.storeId !== rule.storeId) {
      this.storeBasedRepository.removeRuleIdFromStore(currentRule.storeId, currentRule.id!);
      this.storeBasedRepository.addRuleIdToStore(rule.storeId, rule.id!);
    }

    const updatedRule = this.repository.saveDispatchRule<StoreDispatchRule>(rule);
    return new StoreDispatchRule(updatedRule.id, updatedRule.statementItemIDs, updatedRule.storeId);
  }

  list(): StoreDispatchRule[] {
    return this.repository.getDispatchRules()
      .filter(rule => rule.ruleType === DispatchRuleType.STORE)
      .map(rule => new StoreDispatchRule(rule.id, rule.statementItemIDs, (rule as StoreDispatchRule).storeId));
  }
  
  listByStore(storeId: number): StoreDispatchRule[] {
    return this.storeBasedRepository.getDispatchRuleIdsForStore(storeId)
      .map(id => this.get(id)!)
      .filter(rule => !!rule) as StoreDispatchRule[];
  }

  get(id: number): StoreDispatchRule | null {
    const rule = this.repository.getDispatchRule(id);
    if (rule && rule.ruleType === DispatchRuleType.STORE) {
      return new StoreDispatchRule(rule.id, rule.statementItemIDs, (rule as StoreDispatchRule).storeId);
    }

    return null;
  }
}