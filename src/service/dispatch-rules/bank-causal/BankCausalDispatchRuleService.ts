import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { CausalDispatchRule } from "../../../models/types/dispatch-rules/bank/CausalDispatchRule";
import { BankCausalDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/BankCausalDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class BankCausalDispatchRuleService extends BaseDispatchRuleService<CausalDispatchRule> {
    public readonly ruleType = DispatchRuleType.BANK_CAUSAL;
    public readonly indexRepository: BankCausalDispatchRuleIndexRepository = BankCausalDispatchRuleIndexRepository.instance;
  
    public override onCreate(rule: CausalDispatchRule): void {
        this.indexRepository.addRuleIdToCodes(
            rule.domainCode,
            rule.familyCode,
            rule.subFamilyCode,
            rule.id!
        );
    }

    public override onUpdate(currentRule: CausalDispatchRule, newRule: CausalDispatchRule): void {
        if (
            currentRule.domainCode !== newRule.domainCode ||
            currentRule.familyCode !== newRule.familyCode ||
            currentRule.subFamilyCode !== newRule.subFamilyCode
        ) {
            this.indexRepository.removeRuleIdFromCodes(
                currentRule.domainCode,
                currentRule.familyCode,
                currentRule.subFamilyCode,
                currentRule.id!
            );
            this.indexRepository.addRuleIdToCodes(
                newRule.domainCode,
                newRule.familyCode,
                newRule.subFamilyCode,
                newRule.id!
            );
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.domainCode.length < 1) {
            throw new Error("Bank causal dispatch rule must have a domain code");
        }
        if (ruleDto.familyCode.length < 1) {
            throw new Error("Bank causal dispatch rule must have a family code");
        }
        if (ruleDto.subFamilyCode.length < 1) {
            throw new Error("Bank causal dispatch rule must have a sub-family code");
        }
    }

    public mapToConcreteRule(rule: DispatchRule): CausalDispatchRule {
        return new CausalDispatchRule(
            rule.id!,
            rule.statementItemIDs,
            rule.accountingOperation,
            (rule as CausalDispatchRule).domainCode,
            (rule as CausalDispatchRule).familyCode,
            (rule as CausalDispatchRule).subFamilyCode,
            rule.validFrom,
            rule.validTo
        );
    }
    
    public listByFullCausal(domainCode: string, familyCode: string, subFamilyCode: string): CausalDispatchRule[] {
        const domainRules = this.listByDomainCode(domainCode);
        const familyRules = this.listByFamilyCode(familyCode);
        const subFamilyRules = this.listBySubFamilyCode(subFamilyCode);
        
        // filter rules that are in all three lists by their id
        return domainRules.filter(rule => {
            return familyRules.some(familyRule => familyRule.id === rule.id) &&
                subFamilyRules.some(subFamilyRule => subFamilyRule.id === rule.id);
        });
    }

    public listByDomainCode(domainCode: string): CausalDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsByDomain(domainCode)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as CausalDispatchRule[];
    }

    public listByFamilyCode(familyCode: string): CausalDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsByFamily(familyCode)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as CausalDispatchRule[];
    }

    public listBySubFamilyCode(subFamilyCode: string): CausalDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsBySubFamily(subFamilyCode)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as CausalDispatchRule[];
    }
} 