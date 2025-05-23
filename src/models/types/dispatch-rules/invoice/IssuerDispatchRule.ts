import { AccountingOperation } from "../AccountingOperation";
import { DispatchRule, DispatchRuleDto } from "../DispatchRule";
import { DispatchRuleType } from "../DispatchRuleTypes";
import { InvoicePartyReference } from "./InvoicePartyReference";

export class IssuerDispatchRule extends DispatchRule {
  public issuerReference: InvoicePartyReference;

  constructor(
    id: number | undefined,
    statementItemIDs: number[],
    accountingOperation: AccountingOperation,
    issuerReference: InvoicePartyReference,
    validFrom?: Date,
    validTo?: Date,
    dispatchRuleType: DispatchRuleType = DispatchRuleType.INVOICE_ISSUER,
  ) {
    super(id, dispatchRuleType, statementItemIDs, accountingOperation, validFrom, validTo);
    this.issuerReference = issuerReference;
  }
  
  public override toDto(): DispatchRuleDto {
    const dto = super.toDto();
    dto.issuer = [this.issuerReference.toDto()];
    return dto;
  }

  static fromDto(dto: DispatchRuleDto): IssuerDispatchRule {
    const issuerRef = dto.issuer.length > 0 
      ? InvoicePartyReference.fromDto({
          id: dto.issuer[0]?.id || [],
          name: dto.issuer[0]?.name || []
        })
      : new InvoicePartyReference();
      
    return new IssuerDispatchRule(
      dto.id,
      dto.statementItemIDs,
      dto.accountingOperation,
      issuerRef,
      dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
      dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
    );
  }
}