import { DispatchRule, DispatchRuleDto } from "../../models/types/dispatch-rules/DispatchRule";

export interface IDispatchRuleService<T extends DispatchRule> {
    create(ruleDto: DispatchRuleDto): T;
    update(ruleDto: DispatchRuleDto): T;
    list(): T[];
    get(id: number): T | null;
}
