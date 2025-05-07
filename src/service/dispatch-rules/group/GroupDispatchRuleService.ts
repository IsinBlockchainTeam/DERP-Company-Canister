import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { GroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { GroupDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/GroupDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class GroupDispatchRuleService extends BaseDispatchRuleService<GroupDispatchRule> {
    protected readonly ruleType = DispatchRuleType.GROUP;
    protected readonly indexRepository: GroupDispatchRuleIndexRepository = GroupDispatchRuleIndexRepository.instance;
    
    protected override onCreate(rule: GroupDispatchRule): void {
        this.indexRepository.addRuleIdToGroup(rule.groupId, rule.id!);
    }

    protected override onUpdate(currentRule: GroupDispatchRule, newRule: GroupDispatchRule): void {
        if (currentRule.groupId !== newRule.groupId) {
            this.indexRepository.removeRuleIdFromGroup(currentRule.groupId, currentRule.id!);
            this.indexRepository.addRuleIdToGroup(newRule.groupId, newRule.id!);
        }
    }
    
    protected instantiateRule(ruleDto: DispatchRuleDto): GroupDispatchRule {
        return new GroupDispatchRule(
            undefined,
            ruleDto.statementItemIDs,
            ruleDto.groupId[0]!,
            ruleDto.storeId[0]!,
            ruleDto.accountingOperation,
            ruleDto.validFrom[0] ? new Date(ruleDto.validFrom[0]) : undefined,
            ruleDto.validTo[0] ? new Date(ruleDto.validTo[0]) : undefined
        );
    }

    protected validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.groupId.length < 1) {
            throw new Error("Group dispatch rule must have exactly one group ID");
        }

        if (ruleDto.storeId.length < 1) {
            throw new Error("Group dispatch rule must have exactly one store ID");
        }
    }

    protected mapToConcreteRule(rule: DispatchRule): GroupDispatchRule {
        return new GroupDispatchRule(
            rule.id,
            rule.statementItemIDs,
            (rule as GroupDispatchRule).groupId,
            (rule as GroupDispatchRule).storeId,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    listByGroup(groupId: string): GroupDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsForGroup(groupId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as GroupDispatchRule[];
    }

}
