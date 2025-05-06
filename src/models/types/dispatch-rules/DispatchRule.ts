import { DispatchRuleType } from "./DispatchRuleTypes";
import { AccountingOperation } from "./AccountingOperation";

export abstract class DispatchRule {
    id?: number;
    ruleType: DispatchRuleType;
    statementItemIDs: number[];
    accountingOperation: AccountingOperation;

    constructor(
        id: number | undefined,
        type: DispatchRuleType,
        statementItemIDs: number[],
        accountingOperation: AccountingOperation,
    ) {
        this.id = id;
        this.ruleType = type;
        this.statementItemIDs = statementItemIDs;
        this.accountingOperation = accountingOperation;
    }

    toDto(): DispatchRuleDto {
        const dto = {
            ...this,
            txType: [],
            groupId: [],
            storeId: [],
            vatGroupId: [],
        } as DispatchRuleDto;

        return dto;
    }
}

export type DispatchRuleDto = {
    id: number | undefined;
    ruleType: DispatchRuleType;
    statementItemIDs: number[];
    accountingOperation: AccountingOperation;
    txType: [string] | [];
    storeId: [number] | [];
    groupId: [string] | [];
    vatGroupId: [string] | [];
}
