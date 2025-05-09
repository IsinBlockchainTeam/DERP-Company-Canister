import { DispatchRule, DispatchRuleDto } from "../../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../../models/types/dispatch-rules/DispatchRuleTypes";
import { AccountDispatchRule } from "../../../models/types/dispatch-rules/bank/AccountDispatchRule";
import { BankAccountDispatchRuleIndexRepository } from "../../../repositories/dispatch-rules/BankAccountDispatchRuleIndexRepository";
import { BaseDispatchRuleService } from "../BaseDispatchRuleService";

export class BankAccountDispatchRuleService extends BaseDispatchRuleService<AccountDispatchRule> {
    public readonly ruleType = DispatchRuleType.BANK_ACCOUNT;
    public readonly indexRepository: BankAccountDispatchRuleIndexRepository = BankAccountDispatchRuleIndexRepository.instance;
  
    public override onCreate(rule: AccountDispatchRule): void {
        this.indexRepository.addRuleIdToIBAN(rule.IBAN, rule.id!);
    }

    public override onUpdate(currentRule: AccountDispatchRule, newRule: AccountDispatchRule): void {
        if (currentRule.IBAN !== newRule.IBAN) {
            this.indexRepository.removeRuleIdFromIBAN(currentRule.IBAN, currentRule.id!);
            this.indexRepository.addRuleIdToIBAN(newRule.IBAN, newRule.id!);
        }
    }

    public validateRuleDto(ruleDto: DispatchRuleDto | Omit<DispatchRuleDto, 'id'>): void {
        if (ruleDto.IBAN.length < 1) {
            throw new Error("Bank account dispatch rule must have exactly one IBAN");
        }
    }

    public mapToConcreteRule(rule: DispatchRule): AccountDispatchRule {
        return new AccountDispatchRule(
            rule.id,
            rule.statementItemIDs,
            (rule as AccountDispatchRule).IBAN,
            rule.accountingOperation,
            rule.validFrom,
            rule.validTo
        );
    }

    public listByIBAN(iban: string): AccountDispatchRule[] {
        return this.indexRepository.getDispatchRuleIdsForIBAN(iban)
            .map(id => this.get(id)!)
            .filter(rule => !!rule) as AccountDispatchRule[];
    }
}