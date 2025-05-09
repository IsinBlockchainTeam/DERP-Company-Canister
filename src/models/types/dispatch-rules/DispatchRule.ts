import { DispatchRuleType } from "./DispatchRuleTypes";
import { AccountingOperation } from "./AccountingOperation";

export abstract class DispatchRule {
    id?: number;
    ruleType: DispatchRuleType;
    statementItemIDs: number[];
    accountingOperation: AccountingOperation;
    validFrom?: Date;
    validTo?: Date;

    constructor(
        id: number | undefined,
        type: DispatchRuleType,
        statementItemIDs: number[],
        accountingOperation: AccountingOperation,
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
            rules: [],
            validFrom: this.validFrom ? [this.validFrom.toISOString()] : [],
            validTo: this.validTo ? [this.validTo.toISOString()] : [],
        } as DispatchRuleDto;

        return dto;
    }
    
}

export type ChildDispatchRuleDto = {
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
    contributes: [boolean] | [];
}

export type DispatchRuleDto = {
    id: number;
    statementItemIDs: number[];
    accountingOperation: AccountingOperation;
    ruleType: DispatchRuleType;
    validFrom: [string] | [];
    validTo: [string] | [];
    
    // Type-specific fields
    counterpartName: [string] | [];
    movementType: [string] | [];
    IBAN: [string] | [];
    domainCode: [string] | [];
    familyCode: [string] | [];
    subFamilyCode: [string] | [];
    txType: [string] | [];
    storeId: [number] | [];
    groupId: [string] | [];
    vatGroupId: [string] | [];

    // Only for combined rules
    rules: [ChildDispatchRuleDto[]] | [];
}
