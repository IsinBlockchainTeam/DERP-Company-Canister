import { DispatchRuleType } from "./DispatchRuleTypes";

export abstract class DispatchRule {
    id?: number;
    ruleType: DispatchRuleType;
    statementItemIDs: number[];

    constructor(
        id: number | undefined,
        type: DispatchRuleType,
        statementItemIDs: number[],
    ) {
        this.id = id;
        this.ruleType = type;
        this.statementItemIDs = statementItemIDs;
    }

    toDto(): DispatchRuleDto {
        const dto = {
            ...this,
            txType: [],
            groupId: [],
        } as DispatchRuleDto;

        return dto;
    }
}

export type DispatchRuleDto = {
    id: number | undefined;
    ruleType: string;
    statementItemIDs: number[];
    txType: [string] | [];
    groupId: [string] | [];
}
