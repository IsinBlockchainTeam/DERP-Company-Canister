import { AccountingTransactionType } from "../../../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { TypeDispatchRule } from "../../../models/types/dispatch-rules/TypeDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { TypeDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/TypeDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class TypeDispatchRuleService extends BaseDispatchRuleService<TypeDispatchRule> {
    public readonly ruleType = DispatchRuleType.TYPE;
    public readonly indexRepository: TypeDispatchRuleIndexRepository = TypeDispatchRuleIndexRepository.instance;
    
    public override onCreate(rule: TypeDispatchRule): void {
        this.indexRepository.addRuleIdToType(rule.txType, rule.id!);
    }

    public override onUpdate(currentRule: TypeDispatchRule, newRule: TypeDispatchRule): void {
        if (currentRule.txType !== newRule.txType) {
            this.indexRepository.removeRuleIdFromType(currentRule.txType, currentRule.id!);
            this.indexRepository.addRuleIdToType(newRule.txType, newRule.id!);
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, "id">): void {
        if (ruleDto.txType.length < 1) {
            throw new Error("Type dispatch rule must have exactly one transaction type");
        }   

        const type = ruleDto.txType[0]!;
        if (!Object.values(AccountingTransactionType).includes(type as AccountingTransactionType)) {
            throw new Error(`Invalid transaction type: ${type}`);
        }
    }

    public mapToConcreteRule(rule: DispatchRule): TypeDispatchRule {
        return new TypeDispatchRule(
            rule.id,
            rule.statementItemIDs,
            (rule as TypeDispatchRule).txType,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    public listByType(type: string): TypeDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsForType(type)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as TypeDispatchRule[];
    }
}
