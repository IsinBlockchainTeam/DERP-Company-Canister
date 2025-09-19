import { AccountingOperation } from '../AccountingOperation';
import { DispatchRule, DispatchRuleDto } from '../DispatchRule';
import { DispatchRuleType } from '../DispatchRuleTypes';
import { InvoicePartyReference } from './InvoicePartyReference';

export class RecipientDispatchRule extends DispatchRule {
  public recipientReference: InvoicePartyReference;

  constructor(
    id: number | undefined,
    statementItemIDs: number[],
    recipientReference: InvoicePartyReference,
    accountingOperation?: AccountingOperation,
    validFrom?: Date,
    validTo?: Date,
    dispatchRuleType: DispatchRuleType = DispatchRuleType.INVOICE_RECIPIENT,
  ) {
    super(id, dispatchRuleType, statementItemIDs, accountingOperation, validFrom, validTo);
    this.recipientReference = recipientReference;
  }
  
  public override toDto(): DispatchRuleDto {
    const dto = super.toDto();
    dto.recipient = [this.recipientReference.toDto()];
    return dto;
  }

  static fromDto(dto: DispatchRuleDto): RecipientDispatchRule {
    const recipientRef = dto.recipient.length > 0 
      ? InvoicePartyReference.fromDto({
          id: dto.recipient[0]?.id || [],
          name: dto.recipient[0]?.name || []
        })
      : new InvoicePartyReference();
     //TODO verify accounting operation
    return new RecipientDispatchRule(
      dto.id,
      dto.statementItemIDs,
      recipientRef,
      AccountingOperation.DEBIT,
      dto.validFrom[0] ? new Date(dto.validFrom[0]) : undefined,
      dto.validTo[0] ? new Date(dto.validTo[0]) : undefined,
    );
  }
} 