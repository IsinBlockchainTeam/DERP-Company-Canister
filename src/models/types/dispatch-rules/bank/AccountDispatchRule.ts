import {AccountingOperation} from "../AccountingOperation";
import {DispatchRule, DispatchRuleDto} from "../DispatchRule";
import {DispatchRuleType} from "../DispatchRuleTypes";

export class AccountDispatchRule extends DispatchRule {
  public IBAN: string;

  constructor(
    id: number | undefined,
    statementItemIDs: number[],
    IBAN: string,
    accountingOperation?: AccountingOperation,
    validFrom?: Date,
    validTo?: Date,
    dispatchRuleType: DispatchRuleType = DispatchRuleType.BANK_ACCOUNT,
  ) {
    super(id, dispatchRuleType, statementItemIDs, accountingOperation, validFrom, validTo);
    this.IBAN = IBAN;
  }

  override toDto(): DispatchRuleDto {
    return {
      ...super.toDto(),
      IBAN: [this.IBAN],
    };
  }

  static fromDto(dto: DispatchRuleDto): AccountDispatchRule {
    return new AccountDispatchRule(
      dto.id,
      dto.statementItemIDs,
      dto.IBAN[0]!,
      AccountingOperation.DEBIT,
      dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
      dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
      DispatchRuleType.BANK_ACCOUNT,
    );
  }
}