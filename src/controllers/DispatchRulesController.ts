import { IDL, query, update } from "azle";
import { IDLCreateDispatchRule, IDLDispatchRule } from "../models/IDLs/dispatch-rules/IDLCreateDispatchRule";
import { DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleService } from "../service/DispatchRulesService";

class DispatchRulesController {
    @query([], IDL.Vec(IDLDispatchRule))
    async getDispatchRules(): Promise<DispatchRuleDto[]> {
        const svc = new DispatchRuleService();
        return svc.getDispatchRules().map((rule) => rule.toDto());
    }

    @query([IDL.Int32], IDLDispatchRule)
    async getDispatchRule(id: number): Promise<DispatchRuleDto> {
        const svc = new DispatchRuleService();
        const resp = svc.getDispatchRule(id);
        if (resp === null) {
            throw new Error(`DispatchRule with id ${id} not found`);
        }

        return resp.toDto();
    }

    @update([IDL.Int32])
    async deleteDispatchRule(id: number): Promise<void> {
        const svc = new DispatchRuleService();
        svc.deleteDispatchRule(id);
    }

    @update([IDLCreateDispatchRule], IDLDispatchRule)
    async createDispatchRule(ruleRequest: DispatchRuleDto): Promise<DispatchRuleDto> {
        const svc = new DispatchRuleService();
        const rule = svc.createDispatchRule(ruleRequest);
        return rule.toDto();
    }

    @update([IDLDispatchRule], IDLDispatchRule)
    async updateDispatchRule(ruleRequest: DispatchRuleDto): Promise<DispatchRuleDto> {
        const svc = new DispatchRuleService();
        const rule = svc.updateDispatchRule(ruleRequest);
        return rule.toDto();
    }
}

export default DispatchRulesController;
