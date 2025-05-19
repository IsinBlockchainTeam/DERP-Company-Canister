import { AccountingOperation } from "../AccountingOperation";
import { DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { StoreDispatchRule } from "./StoreDispatchRule";

export class PaymentMethodDispatchRule extends StoreDispatchRule {
  public paymentMethodId: string;

  constructor(
    id: number | undefined,
    statementItemIDs: number[],
    paymentMethodId: string,
    storeId: number,
    accountingOperation: AccountingOperation,
    validFrom?: Date,
    validTo?: Date,
    dispatchRuleType: DispatchRuleType = DispatchRuleType.PAYMENT_METHOD,
  ) {
    super(id, statementItemIDs, storeId, accountingOperation, validFrom, validTo, dispatchRuleType);
    this.paymentMethodId = paymentMethodId;
  }
  
  override toDto(): DispatchRuleDto {
    return {
      ...super.toDto(),
      paymentMethodId: [this.paymentMethodId],
    };
  }
  
  static fromDto(dto: DispatchRuleDto): PaymentMethodDispatchRule {
    return new PaymentMethodDispatchRule(
      dto.id,
      dto.statementItemIDs,
      dto.paymentMethodId[0]!,
      dto.storeId[0]!,
      dto.accountingOperation,
      dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
      dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
    );
  }
}