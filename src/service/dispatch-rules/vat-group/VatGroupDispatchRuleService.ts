import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { VatGroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/VatGroupDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { VatGroupDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/VatGroupDispatchRuleIndexRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class VatGroupDispatchRuleService extends BaseDispatchRuleService<VatGroupDispatchRule> {
    private readonly vatGroupBasedRepository: VatGroupDispatchRuleIndexRepository = VatGroupDispatchRuleIndexRepository.instance;
    protected readonly ruleType = DispatchRuleType.VAT_GROUP;
    
    protected onCreate(rule: VatGroupDispatchRule): void {
        this.vatGroupBasedRepository.addRuleIdToGroup(rule.vatGroupId, rule.id!);
    }

    protected onUpdate(currentRule: VatGroupDispatchRule, newRule: VatGroupDispatchRule): void {
        if (currentRule.vatGroupId !== newRule.vatGroupId) {
            this.vatGroupBasedRepository.removeRuleIdFromGroup(currentRule.vatGroupId, currentRule.id!);
            this.vatGroupBasedRepository.addRuleIdToGroup(newRule.vatGroupId, newRule.id!);
        }
    }
    
    protected instantiateRule(ruleDto: DispatchRuleDto): VatGroupDispatchRule {
        return new VatGroupDispatchRule(
            undefined,
            ruleDto.statementItemIDs,
            ruleDto.vatGroupId[0]!,
            ruleDto.storeId[0]!,
            ruleDto.accountingOperation,
            ruleDto.validFrom[0] ? new Date(ruleDto.validFrom[0]) : undefined,
            ruleDto.validTo[0] ? new Date(ruleDto.validTo[0]) : undefined
        );
    }
    
    protected mapToConcreteRule(rule: DispatchRule): VatGroupDispatchRule {
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

    protected validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.vatGroupId.length < 1) {
            throw new Error("VatGroup dispatch rule must have exactly one vat group ID");
        }

        if (ruleDto.storeId.length < 1) {
            throw new Error("VatGroup dispatch rule must have exactly one store id");
        }
    }

    listByGroup(groupId: string) {
        return this.vatGroupBasedRepository.getDispatchRuleIdsForGroup(groupId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as VatGroupDispatchRule[];
    }

}
