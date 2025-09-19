import {AccountingOperation} from "../AccountingOperation";
import {DispatchRule, DispatchRuleDto} from "../DispatchRule";
import {DispatchRuleType} from "../DispatchRuleTypes";

export class CausalDispatchRule extends DispatchRule {
  public domainCode: string;
  public familyCode: string;
  public subFamilyCode: string;

  constructor(
    id: number | undefined,
    statementItemIDs: number[],
    domainCode: string,
    familyCode: string,
    subFamilyCode: string,
    accountingOperation?: AccountingOperation,
    validFrom?: Date,
    validTo?: Date,
    dispatchRuleType: DispatchRuleType = DispatchRuleType.BANK_CAUSAL,
  ) {
    super(id, dispatchRuleType, statementItemIDs, accountingOperation, validFrom, validTo);
    this.domainCode = domainCode;
    this.familyCode = familyCode;
    this.subFamilyCode = subFamilyCode;
  }
  
  public override toDto(): DispatchRuleDto {
    return {
      ...super.toDto(),
      domainCode: [this.domainCode],
      familyCode: [this.familyCode],
      subFamilyCode: [this.subFamilyCode],
    };
  }

  static fromDto(dto: DispatchRuleDto): CausalDispatchRule {
    return new CausalDispatchRule(
      dto.id,
      dto.statementItemIDs,
      dto.domainCode[0]!,
      dto.familyCode[0]!,
      dto.subFamilyCode[0]!,
      AccountingOperation.CREDIT,
      dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
      dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
    );
  }
}