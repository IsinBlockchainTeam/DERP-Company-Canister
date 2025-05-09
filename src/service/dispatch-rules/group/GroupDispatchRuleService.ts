import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { GroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { GroupDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/GroupDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class GroupDispatchRuleService extends BaseDispatchRuleService<GroupDispatchRule> {
    public readonly ruleType = DispatchRuleType.GROUP;
    public readonly indexRepository: GroupDispatchRuleIndexRepository = GroupDispatchRuleIndexRepository.instance;

    public override onCreate(rule: GroupDispatchRule): void {
        this.indexRepository.addRuleIdToGroup(rule.groupId, rule.id!);
    }

    public override onUpdate(currentRule: GroupDispatchRule, newRule: GroupDispatchRule): void {
        if (currentRule.groupId !== newRule.groupId) {
            this.indexRepository.removeRuleIdFromGroup(currentRule.groupId, currentRule.id!);
            this.indexRepository.addRuleIdToGroup(newRule.groupId, newRule.id!);
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.groupId.length < 1) {
            throw new Error("Group dispatch rule must have exactly one group ID");
        }

        if (ruleDto.storeId.length < 1) {
            throw new Error("Group dispatch rule must have exactly one store ID");
        }
    }

    public mapToConcreteRule(rule: DispatchRule): GroupDispatchRule {
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

    public listByGroup(groupId: string): GroupDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsForGroup(groupId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as GroupDispatchRule[];
    }
}
