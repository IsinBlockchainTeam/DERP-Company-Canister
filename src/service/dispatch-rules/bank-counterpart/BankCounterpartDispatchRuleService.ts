import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { CounterpartDispatchRule } from "../../../models/types/dispatch-rules/bank/CounterpartDispatchRule";
import { BankCounterpartDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/BankCounterpartDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class BankCounterpartDispatchRuleService extends BaseDispatchRuleService<CounterpartDispatchRule> {
    public readonly ruleType = DispatchRuleType.BANK_COUNTERPART;
    public readonly indexRepository: BankCounterpartDispatchRuleIndexRepository = BankCounterpartDispatchRuleIndexRepository.instance;
  
    public override onCreate(rule: CounterpartDispatchRule): void {
        this.indexRepository.addRuleIdToCounterpart(rule.counterpartName, rule.id!);
    }

    public override onUpdate(currentRule: CounterpartDispatchRule, newRule: CounterpartDispatchRule): void {
        if (currentRule.counterpartName !== newRule.counterpartName) {
            this.indexRepository.removeRuleIdFromCounterpart(currentRule.counterpartName, currentRule.id!);
            this.indexRepository.addRuleIdToCounterpart(newRule.counterpartName, newRule.id!);
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.counterpartName.length < 1) {
            throw new Error("Bank counterpart dispatch rule must have a counterpart name");
        }
    }

    public mapToConcreteRule(rule: DispatchRule): CounterpartDispatchRule {
        return new CounterpartDispatchRule(
            rule.id!,
            rule.statementItemIDs,
            (rule as CounterpartDispatchRule).counterpartName,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    public listByCounterpartName(counterpartName: string): CounterpartDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsForCounterpart(counterpartName)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as CounterpartDispatchRule[];
    }
}
