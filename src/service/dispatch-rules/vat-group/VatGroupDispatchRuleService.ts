import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { VatGroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/VatGroupDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { VatGroupDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/VatGroupDispatchRuleIndexRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class VatGroupDispatchRuleService extends BaseDispatchRuleService<VatGroupDispatchRule> {
    public readonly vatGroupBasedRepository: VatGroupDispatchRuleIndexRepository = VatGroupDispatchRuleIndexRepository.instance;
    public readonly ruleType = DispatchRuleType.VAT_GROUP;
    
    public onCreate(rule: VatGroupDispatchRule): void {
        this.vatGroupBasedRepository.addRuleIdToGroup(rule.vatGroupId, rule.id!);
    }

    public onUpdate(currentRule: VatGroupDispatchRule, newRule: VatGroupDispatchRule): void {
        if (currentRule.vatGroupId !== newRule.vatGroupId) {
            this.vatGroupBasedRepository.removeRuleIdFromGroup(currentRule.vatGroupId, currentRule.id!);
            this.vatGroupBasedRepository.addRuleIdToGroup(newRule.vatGroupId, newRule.id!);
        }
    }
    
    public mapToConcreteRule(rule: DispatchRule): VatGroupDispatchRule {
        return new VatGroupDispatchRule(
            rule.id,
            rule.statementItemIDs,
            (rule as VatGroupDispatchRule).vatGroupId,
            (rule as VatGroupDispatchRule).storeId,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.vatGroupId.length < 1) {
            throw new Error("VatGroup dispatch rule must have exactly one vat group ID");
        }

        if (ruleDto.storeId.length < 1) {
            throw new Error("VatGroup dispatch rule must have exactly one store id");
        }
    }

    public listByGroup(groupId: string) {
        return this.vatGroupBasedRepository.getDispatchRuleIdsForGroup(groupId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as VatGroupDispatchRule[];
    }
}
