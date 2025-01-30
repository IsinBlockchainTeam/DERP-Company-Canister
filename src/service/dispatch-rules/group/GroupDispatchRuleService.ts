import { DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { GroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/GroupDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { GroupDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/GroupDispatchRuleIndexRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";

export class GroupDispatchRuleService implements IDispatchRuleService<GroupDispatchRule> {
    private readonly repository: DispatchRuleRepository = DispatchRuleRepository.instance;
    private readonly groupBasedRepository: GroupDispatchRuleIndexRepository = GroupDispatchRuleIndexRepository.instance;

    create(ruleDto: Omit<DispatchRuleDto, 'id'>): GroupDispatchRule {
        // check rule request
        this.validateRuleDto(ruleDto);

        const rule = new GroupDispatchRule(
            undefined,
            ruleDto.statementItemIDs,
            ruleDto.groupId[0]!,
            ruleDto.storeId[0]!,
        )

        const savedRule = this.repository.saveDispatchRule<GroupDispatchRule>(rule);
        if (!savedRule.id) {
            throw new Error("Failed to save dispatch rule");
        }

        this.groupBasedRepository.addRuleIdToGroup(ruleDto.groupId[0]!, savedRule.id);
        return new GroupDispatchRule(savedRule.id, savedRule.statementItemIDs, savedRule.groupId, savedRule.storeId);
    }

    update(ruleDto: DispatchRuleDto): GroupDispatchRule {
        if (!("id" in ruleDto)) {
            throw new Error("Dispatch rule to be updated must have an id");
        }

        this.validateRuleDto(ruleDto);

        const currentRule = this.repository.getDispatchRule(ruleDto.id!) as GroupDispatchRule;
        const rule = new GroupDispatchRule(
            ruleDto.id,
            ruleDto.statementItemIDs,
            ruleDto.groupId[0]!,
            ruleDto.storeId[0]!,
        )

        if(currentRule.groupId !== rule.groupId) {
            this.groupBasedRepository.removeRuleIdFromGroup(currentRule.groupId, currentRule.id!);
            this.groupBasedRepository.addRuleIdToGroup(rule.groupId, currentRule.id!);
        }

        const updatedRule = this.repository.saveDispatchRule<GroupDispatchRule>(rule);
        return new GroupDispatchRule(updatedRule.id, updatedRule.statementItemIDs, updatedRule.groupId, updatedRule.storeId);
    }

    list(): GroupDispatchRule[] {
        return this.repository.getDispatchRules()
            .filter(rule => rule.ruleType === DispatchRuleType.GROUP)
            .map(rule => new GroupDispatchRule(rule.id, rule.statementItemIDs, (rule as GroupDispatchRule).groupId, (rule as GroupDispatchRule).storeId));
    }

    listByGroup(groupId: string) {
        return this.groupBasedRepository.getDispatchRuleIdsForGroup(groupId)
            .map(id => this.get(id))
            .filter(rule => !!rule) as GroupDispatchRule[];
    }

    get(id: number): GroupDispatchRule | null {
        const rule = this.repository.getDispatchRule(id);
        if (rule && rule.ruleType === DispatchRuleType.GROUP) {
            return new GroupDispatchRule(rule.id, rule.statementItemIDs, (rule as GroupDispatchRule).groupId, (rule as GroupDispatchRule).storeId);
        }

        return null;
    }

    private validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.groupId.length < 1) {
            throw new Error("Group dispatch rule must have exactly one group ID");
        }

        if (ruleDto.storeId.length < 1) {
            throw new Error("Group dispatch rule must have exactly one store ID");
        }
    }
}
