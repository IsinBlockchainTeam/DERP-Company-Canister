import { DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { VatGroupDispatchRule } from "../../../models/types/dispatch-rules/ticket/VatGroupDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/DispatchRuleRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";

export class VatGroupDispatchRuleService implements IDispatchRuleService<VatGroupDispatchRule> {
    private readonly repository: DispatchRuleRepository = DispatchRuleRepository.instance;

    create(ruleDto: Omit<DispatchRuleDto, 'id'>): VatGroupDispatchRule {
        // check rule request
        this.validateRuleDto(ruleDto);

        const rule = new VatGroupDispatchRule(
            undefined,
            ruleDto.statementItemIDs,
            ruleDto.vatGroupId[0]!,
            ruleDto.storeId[0]!,
        )

        const savedRule = this.repository.saveDispatchRule<VatGroupDispatchRule>(rule);
        return new VatGroupDispatchRule(savedRule.id, savedRule.statementItemIDs, savedRule.vatGroupId, savedRule.storeId);
    }

    update(ruleDto: DispatchRuleDto): VatGroupDispatchRule {
        if (!("id" in ruleDto)) {
            throw new Error("Dispatch rule to be updated must have an id");
        }

        this.validateRuleDto(ruleDto);

        const rule = new VatGroupDispatchRule(
            ruleDto.id,
            ruleDto.statementItemIDs,
            ruleDto.vatGroupId[0]!,
            ruleDto.storeId[0]!,
        )

        const updatedRule = this.repository.saveDispatchRule<VatGroupDispatchRule>(rule);
        return new VatGroupDispatchRule(updatedRule.id, updatedRule.statementItemIDs, updatedRule.vatGroupId, updatedRule.storeId);
    }

    list(): VatGroupDispatchRule[] {
        return this.repository.getDispatchRules()
            .filter(rule => rule.ruleType === DispatchRuleType.VAT_GROUP)
            .map(rule => new VatGroupDispatchRule(rule.id, rule.statementItemIDs, (rule as VatGroupDispatchRule).vatGroupId, (rule as VatGroupDispatchRule).storeId));
    }

    get(id: number): VatGroupDispatchRule | null {
        const rule = this.repository.getDispatchRule(id);
        if (rule && rule.ruleType === DispatchRuleType.VAT_GROUP) {
            return new VatGroupDispatchRule(rule.id, rule.statementItemIDs, (rule as VatGroupDispatchRule).vatGroupId, (rule as VatGroupDispatchRule).storeId);
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
