import { DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { VatGroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/VatGroupDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { VatGroupDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/VatGroupDispatchRuleIndexRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";

export class VatGroupDispatchRuleService implements IDispatchRuleService<VatGroupDispatchRule> {
    private readonly repository: DispatchRuleRepository = DispatchRuleRepository.instance;
    private readonly vatGroupBasedRepository: VatGroupDispatchRuleIndexRepository = VatGroupDispatchRuleIndexRepository.instance;

    create(ruleDto: Omit<DispatchRuleDto, 'id'>): VatGroupDispatchRule {
        // check rule request
        this.validateRuleDto(ruleDto);

        const rule = new VatGroupDispatchRule(
            undefined,
            ruleDto.statementItemIDs,
            ruleDto.vatGroupId[0]!,
            ruleDto.storeId[0]!,
            ruleDto.accountingOperation
        )

        const savedRule = this.repository.saveDispatchRule<VatGroupDispatchRule>(rule);
        if (!savedRule.id) {
            throw new Error("Failed to save dispatch rule");
        }

        this.vatGroupBasedRepository.addRuleIdToGroup(ruleDto.vatGroupId[0]!, savedRule.id);
        return new VatGroupDispatchRule(savedRule.id, savedRule.statementItemIDs, savedRule.vatGroupId, savedRule.storeId, savedRule.accountingOperation);
    }

    update(ruleDto: DispatchRuleDto): VatGroupDispatchRule {
        if (!("id" in ruleDto)) {
            throw new Error("Dispatch rule to be updated must have an id");
        }

        this.validateRuleDto(ruleDto);

        const currentRule = this.repository.getDispatchRule(ruleDto.id!) as VatGroupDispatchRule;
        const rule = new VatGroupDispatchRule(
            ruleDto.id,
            ruleDto.statementItemIDs,
            ruleDto.vatGroupId[0]!,
            ruleDto.storeId[0]!,
            ruleDto.accountingOperation
        )

        if (currentRule.vatGroupId !== rule.vatGroupId) {
            this.vatGroupBasedRepository.removeRuleIdFromGroup(currentRule.vatGroupId, currentRule.id!);
            this.vatGroupBasedRepository.addRuleIdToGroup(rule.vatGroupId, currentRule.id!);
        }

        const updatedRule = this.repository.saveDispatchRule<VatGroupDispatchRule>(rule);
        return new VatGroupDispatchRule(updatedRule.id, updatedRule.statementItemIDs, updatedRule.vatGroupId, updatedRule.storeId, updatedRule.accountingOperation);
    }

    list(): VatGroupDispatchRule[] {
        return this.repository.getDispatchRules()
            .filter(rule => rule.ruleType === DispatchRuleType.VAT_GROUP)
            .map(rule => new VatGroupDispatchRule(rule.id, rule.statementItemIDs, (rule as VatGroupDispatchRule).vatGroupId, (rule as VatGroupDispatchRule).storeId, rule.accountingOperation));
    }

    listByGroup(groupId: string) {
        return this.vatGroupBasedRepository.getDispatchRuleIdsForGroup(groupId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as VatGroupDispatchRule[];
    }

    get(id: number): VatGroupDispatchRule | null {
        const rule = this.repository.getDispatchRule(id);
        if (rule && rule.ruleType === DispatchRuleType.VAT_GROUP) {
            return new VatGroupDispatchRule(rule.id, rule.statementItemIDs, (rule as VatGroupDispatchRule).vatGroupId, (rule as VatGroupDispatchRule).storeId, rule.accountingOperation);
        }

        return null;
    }

    private validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.vatGroupId.length < 1) {
            throw new Error("VatGroup dispatch rule must have exactly one vat group ID");
        }

        if (ruleDto.storeId.length < 1) {
            throw new Error("VatGroup dispatch rule must have exactly one store id");
        }
    }
}
