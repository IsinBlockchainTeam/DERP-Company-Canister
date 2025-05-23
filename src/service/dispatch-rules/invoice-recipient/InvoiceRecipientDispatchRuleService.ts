import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { RecipientDispatchRule } from "../../../models/types/dispatch-rules/invoice/RecipientDispatchRule";
import { RecipientDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/RecipientDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class InvoiceRecipientDispatchRuleService extends BaseDispatchRuleService<RecipientDispatchRule> {
    public readonly ruleType = DispatchRuleType.INVOICE_RECIPIENT;
    public readonly indexRepository: RecipientDispatchRuleIndexRepository = RecipientDispatchRuleIndexRepository.instance;
  
    public override onCreate(rule: RecipientDispatchRule): void {
        this.indexRepository.addRuleIdToRecipient(
            rule.recipientReference.id,
            rule.recipientReference.name,
            rule.id!
        );
    }

    public override onUpdate(currentRule: RecipientDispatchRule, newRule: RecipientDispatchRule): void {
        const currentId = currentRule.recipientReference.id;
        const currentName = currentRule.recipientReference.name;
        const newId = newRule.recipientReference.id;
        const newName = newRule.recipientReference.name;

        if (currentId !== newId || currentName !== newName) {
            this.indexRepository.removeRuleIdFromRecipient(
                currentId,
                currentName,
                currentRule.id!
            );
            this.indexRepository.addRuleIdToRecipient(
                newId,
                newName,
                newRule.id!
            );
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.recipient.length < 1) {
            throw new Error("Recipient dispatch rule must have a recipient reference");
        }
        
        const recipientRef = ruleDto.recipient[0];
        if (!recipientRef || !recipientRef.id.length && !recipientRef.name.length) {
            throw new Error("Recipient dispatch rule must have either a recipient ID or name");
        }
    }

    public mapToConcreteRule(rule: DispatchRule): RecipientDispatchRule {
        return rule as RecipientDispatchRule;
    }
    
    public listByRecipientId(recipientId: string): RecipientDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsByRecipientId(recipientId)
            .map(id => this.get(id)!)
            .filter(rule => !!rule);
    }

    public listByRecipientName(recipientName: string): RecipientDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsByRecipientName(recipientName)
            .map(id => this.get(id)!)
            .filter(rule => !!rule);
    }
} 