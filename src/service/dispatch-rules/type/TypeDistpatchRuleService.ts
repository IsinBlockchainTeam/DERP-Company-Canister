import { AccountingTransactionType } from "../../../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { TypeDispatchRule } from "../../../models/types/dispatch-rules/TypeDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { TypeDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/TypeDispatchRuleIndexRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";

export class TypeDispatchRuleService implements IDispatchRuleService<TypeDispatchRule> {
    private readonly repository: DispatchRuleRepository = DispatchRuleRepository.instance;
    private readonly typeBasedRepository: TypeDispatchRuleIndexRepository = TypeDispatchRuleIndexRepository.instance;

    create(ruleDto: DispatchRuleDto): TypeDispatchRule {
        // check rule request
        if (ruleDto.txType.length < 1) {
            throw new Error("Type dispatch rule must have exactly one transaction type");
        }

        const type = ruleDto.txType[0]!;
        // check type in enum AccountingTransactionType
        if (!Object.values(AccountingTransactionType).includes(type as AccountingTransactionType)) {
            throw new Error(`Invalid transaction type: ${type}`);
        }


        const rule = new TypeDispatchRule(
            undefined,
            ruleDto.statementItemIDs,
            type as AccountingTransactionType
        )

        const savedRule = this.repository.saveDispatchRule<TypeDispatchRule>(rule);
        if (!savedRule.id) {
            throw new Error("Failed to save dispatch rule");
        }

        this.typeBasedRepository.addRuleIdToType(type, savedRule.id);
        return new TypeDispatchRule(savedRule.id, savedRule.statementItemIDs, savedRule.txType);
    }

    update(ruleDto: DispatchRuleDto): TypeDispatchRule {
        if (!("id" in ruleDto)) {
            throw new Error("Dispatch rule to be updated must have an id");
        }

        const currentRule = this.repository.getDispatchRule(ruleDto.id!) as TypeDispatchRule;
        const rule = new TypeDispatchRule(
            ruleDto.id,
            ruleDto.statementItemIDs,
            ruleDto.txType[0] as AccountingTransactionType
        )

        if (currentRule.txType !== rule.txType) {
            this.typeBasedRepository.removeRuleIdFromType(currentRule.txType, currentRule.id!);
            this.typeBasedRepository.addRuleIdToType(rule.txType, currentRule.id!);
        }

        const updatedRule = this.repository.saveDispatchRule<TypeDispatchRule>(rule);
        return new TypeDispatchRule(updatedRule.id, updatedRule.statementItemIDs, updatedRule.txType);
    }

    list(): TypeDispatchRule[] {
        return this.repository.getDispatchRules()
            .filter(rule => rule.ruleType === DispatchRuleType.TYPE)
            .map(rule => new TypeDispatchRule(rule.id, rule.statementItemIDs, (rule as TypeDispatchRule).txType));
    }

    listByType(type: string) {
        return this.typeBasedRepository.getDispatchRuleIdsForType(type)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as TypeDispatchRule[];
    }

    get(id: number): TypeDispatchRule | null {
        const rule = this.repository.getDispatchRule(id);
        if (rule && rule.ruleType === DispatchRuleType.TYPE) {
            return new TypeDispatchRule(rule.id, rule.statementItemIDs, (rule as TypeDispatchRule).txType);
        }

        return null;
    }
}
