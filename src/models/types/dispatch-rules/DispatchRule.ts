import { DispatchRuleType } from "./DispatchRuleTypes";
import { AccountingOperation } from "./AccountingOperation";
import { TypeDispatchRule } from "./TypeDispatchRule";
import { GroupDispatchRule } from "./ticket/GroupDispatchRule";
import { StoreDispatchRule } from "./ticket/StoreDispatchRule";
import { VatGroupDispatchRule } from "./ticket/VatGroupDispatchRule";

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
            validFrom: this.validFrom ? [this.validFrom.toISOString()] : [],
            validTo: this.validTo ? [this.validTo.toISOString()] : [],
        } as DispatchRuleDto;

        return dto;
    }
    
}

export type DispatchRuleDto = {
    id: number;
    statementItemIDs: number[];
    accountingOperation: AccountingOperation;
    ruleType: DispatchRuleType;
    validFrom: [string] | [];
    validTo: [string] | [];
    txType: [string] | [];
    storeId: [number] | [];
    groupId: [string] | [];
    vatGroupId: [string] | [];
}
