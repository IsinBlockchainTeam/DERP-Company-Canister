import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { IssuerDispatchRule } from "../../../models/types/dispatch-rules/invoice/IssuerDispatchRule";
import { IssuerDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/IssuerDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class InvoiceIssuerDispatchRuleService extends BaseDispatchRuleService<IssuerDispatchRule> {
    public readonly ruleType = DispatchRuleType.INVOICE_ISSUER;
    public readonly indexRepository: IssuerDispatchRuleIndexRepository = IssuerDispatchRuleIndexRepository.instance;
  
    public override onCreate(rule: IssuerDispatchRule): void {
        this.indexRepository.addRuleIdToIssuer(
            rule.issuerReference.id,
            rule.issuerReference.name,
            rule.id!
        );
    }

    public override onUpdate(currentRule: IssuerDispatchRule, newRule: IssuerDispatchRule): void {
        const currentId = currentRule.issuerReference.id;
        const currentName = currentRule.issuerReference.name;
        const newId = newRule.issuerReference.id;
        const newName = newRule.issuerReference.name;

        if (currentId !== newId || currentName !== newName) {
            this.indexRepository.removeRuleIdFromIssuer(
                currentId,
                currentName,
                currentRule.id!
            );
            this.indexRepository.addRuleIdToIssuer(
                newId,
                newName,
                newRule.id!
            );
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.issuer.length < 1) {
            throw new Error("Issuer dispatch rule must have an issuer reference");
        }
        
        const issuerRef = ruleDto.issuer[0];
        if (!issuerRef || !issuerRef.id.length && !issuerRef.name.length) {
            throw new Error("Issuer dispatch rule must have either an issuer ID or name");
        }
    }

    public mapToConcreteRule(rule: DispatchRule): IssuerDispatchRule {
        return rule as IssuerDispatchRule;
    }
    
    public listByIssuerId(issuerId: string): IssuerDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsByIssuerId(issuerId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule);
    }

    public listByIssuerName(issuerName: string): IssuerDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsByIssuerName(issuerName)
            .map(id => this.get(id)!)
            .filter(rule => !!rule);
    }
} 