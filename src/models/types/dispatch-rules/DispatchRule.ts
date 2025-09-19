import { DispatchRuleType } from "./DispatchRuleTypes";
import { AccountingOperation } from "./AccountingOperation";
import { InvoicePartyReferenceDto } from "./invoice/InvoicePartyReference";

export abstract class DispatchRule {
    id?: number;
    ruleType: DispatchRuleType;
    statementItemIDs: number[];
    accountingOperation?: AccountingOperation;
    validFrom?: Date;
    validTo?: Date;

    constructor(
        id: number | undefined,
        type: DispatchRuleType,
        statementItemIDs: number[],
        accountingOperation?: AccountingOperation,
        validFrom?: Date,
        validTo?: Date,
    ) {
        this.id = id;
        this.ruleType = type;
        this.statementItemIDs = statementItemIDs;
        this.accountingOperation = accountingOperation;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }

    toDto(): DispatchRuleDto {
        const dto = {
            ...this,
            txType: [],
            groupId: [],
            storeId: [],
            vatGroupId: [],
            movementType: [],
            counterpartName: [],
            IBAN: [],
            domainCode: [],
            familyCode: [],
            subFamilyCode: [],
            paymentMethodId: [],
            issuer: [],
            recipient: [],
            rules: [],
            accountingOperation: this.accountingOperation ? [this.accountingOperation] : [],
            validFrom: this.validFrom ? [this.validFrom.toISOString()] : [],
            validTo: this.validTo ? [this.validTo.toISOString()] : [],
        } as DispatchRuleDto;

        return dto;
    }
    
}

// Types shared between child rules and parent rules
export type BaseDispatchRuleDto = {
    ruleType: DispatchRuleType;
    txType: [string] | [];
    storeId: [number] | [];
    groupId: [string] | [];
    vatGroupId: [string] | [];
    counterpartName: [string] | [];
    movementType: [string] | [];
    IBAN: [string] | [];
    domainCode: [string] | [];
    familyCode: [string] | [];
    subFamilyCode: [string] | [];
    paymentMethodId: [string] | [];
    issuer: [InvoicePartyReferenceDto] | [];
    recipient: [InvoicePartyReferenceDto] | [];
}

export type ChildDispatchRuleDto = BaseDispatchRuleDto & {
    contributes: [boolean] | [];
}

export type DispatchRuleDto = BaseDispatchRuleDto & {
    id: number;
    statementItemIDs: number[];
    accountingOperation: [AccountingOperation] | [];
    validFrom: [string] | [];
    validTo: [string] | [];

    // Only for combined rules
    rules: [ChildDispatchRuleDto[]] | [];
}
