import {DispatchRuleEntityMapper} from "../../../service/DispatchRuleEntityMapper";
import {AccountingOperation} from "./AccountingOperation";
import {DispatchRule, DispatchRuleDto} from "./DispatchRule";
import {DispatchRuleType} from "./DispatchRuleTypes";

export interface ChildRule extends DispatchRule {
  contributes: boolean | undefined;
}

export class CombinedDispatchRule extends DispatchRule{
  public rules: ChildRule[];
  constructor(
    id: number | undefined,
    statementItemIDs: number[],
    accountingOperation: AccountingOperation,
    rules: ChildRule[],
    validFrom?: Date,
    validTo?: Date,
  ) {
    super(id, DispatchRuleType.COMBINED, statementItemIDs, accountingOperation, validFrom, validTo);
    this.rules = rules;
  }
  
  public toDto(): DispatchRuleDto {
    return {
      ...super.toDto(),
      rules: this.rules.length > 0 ? [this.rules.map(rule => {
        const dto = rule.toDto();
        return {
          ...super.toDto(),
          ...dto,
          contributes: rule.contributes !== undefined ? [rule.contributes] : [] // Default to true if not specified
        };
      })] : [],
    };
  }
  
  static fromDto(dto: DispatchRuleDto): CombinedDispatchRule {
    // Each child rule must be a complete rule to be understood by its services.
    // This is done by merging the properties of the child rule with the properties of the combined parent rule.
    const childRules = dto.rules[0]!.map(childRule => {
      const cleanedChildRule = Object.fromEntries(
        Object.entries(childRule).filter(([_, value]) => value !== null && value !== undefined)
      );

      const rule = {
        ...dto,
        ...cleanedChildRule,
      }
      
      const baseRule = DispatchRuleEntityMapper.fromDto(rule) as ChildRule;
      baseRule.contributes = childRule.contributes.length > 0 ? childRule.contributes[0] : undefined;
      return baseRule;
    });
    

    return new CombinedDispatchRule(
      dto.id,
      dto.statementItemIDs,
      AccountingOperation.DEBIT,
      childRules,
      dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
      dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
    );
  }
}