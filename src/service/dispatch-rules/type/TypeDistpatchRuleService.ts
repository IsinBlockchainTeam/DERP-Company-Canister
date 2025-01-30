import { AccountingTransactionType } from "../../../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { TypeDispatchRule } from "../../../models/types/dispatch-rules/TypeDispatchRule";
import { DispatchRuleRepository } from "../../../repositories/dispatch-rules/DispatchRuleRepository";
import { IDispatchRuleService } from "../IDispatchRuleService";

export class TypeDispatchRuleService implements IDispatchRuleService<TypeDispatchRule> {
    private readonly repository: DispatchRuleRepository = DispatchRuleRepository.instance;

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
        return new TypeDispatchRule(savedRule.id, savedRule.statementItemIDs, savedRule.txType);
    }

    update(ruleDto: DispatchRuleDto): TypeDispatchRule {
        if (!("id" in ruleDto)) {
            throw new Error("Dispatch rule to be updated must have an id");
        }

        const rule = new TypeDispatchRule(
            ruleDto.id,
            ruleDto.statementItemIDs,
            ruleDto.txType[0] as AccountingTransactionType
        )

        const updatedRule = this.repository.saveDispatchRule<TypeDispatchRule>(rule);
        return new TypeDispatchRule(updatedRule.id, updatedRule.statementItemIDs, updatedRule.txType);
    }

    list(): TypeDispatchRule[] {
        return this.repository.getDispatchRules()
            .filter(rule => rule.ruleType === DispatchRuleType.TYPE)
            .map(rule => new TypeDispatchRule(rule.id, rule.statementItemIDs, (rule as TypeDispatchRule).txType));
    }

    get(id: number): TypeDispatchRule | null {
        const rule = this.repository.getDispatchRule(id);
        if (rule && rule.ruleType === DispatchRuleType.TYPE) {
            return new TypeDispatchRule(rule.id, rule.statementItemIDs, (rule as TypeDispatchRule).txType);
        }

        return null;
    }
}
