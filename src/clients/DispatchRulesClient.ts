import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { createActor } from "../declarations/dlterp_company";
import { DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";

export class DispatchRulesClient {
    private readonly actor: ActorSubclass<_SERVICE>

    constructor(serverAddress: string, canisterId: string) {
        const agent = HttpAgent.createSync({ host: serverAddress })
        this.actor = createActor(canisterId, { agent })
    }

    async createDispatchRule(rule: DispatchRuleDto): Promise<DispatchRuleDto> {
        return this.actor.createDispatchRule(rule) as Promise<DispatchRuleDto>
    }

    async getDispatchRules(): Promise<DispatchRuleDto[]> {
        return this.actor.getDispatchRules() as Promise<DispatchRuleDto[]>
    }

    async deleteDispatchRule(id: number) {
        return this.actor.deleteDispatchRule(id);
    }

    async updateDispatchRule(ruleRequest: DispatchRuleDto): Promise<DispatchRuleDto> {
        if(ruleRequest.id === undefined) {
            throw new Error("Missing id on update rule request")
        }
        return this.actor.updateDispatchRule({
            ...ruleRequest,
            id: ruleRequest.id
        }) as Promise<DispatchRuleDto>
    }
}
