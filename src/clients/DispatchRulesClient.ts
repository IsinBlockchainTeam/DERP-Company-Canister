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
    
    async createDispatchRules(rules: DispatchRuleDto[]): Promise<DispatchRuleDto[]> {
        const chunks = rules.reduce((acc, rule, index) => {
            const chunkIndex = Math.floor(index / 100);
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = [];
            }
            acc[chunkIndex].push(rule);
            return acc;
        }, [] as DispatchRuleDto[][]);

        const result: DispatchRuleDto[] = [];
        for (const chunk of chunks) {
            const createdRules = await this.actor.createDispatchRules(chunk);
            result.push(...createdRules as DispatchRuleDto[]);
        }

        return result;
    }

    async getDispatchRules(): Promise<DispatchRuleDto[]> {
        return this.actor.getDispatchRules() as Promise<DispatchRuleDto[]>
    }

    async deleteDispatchRule(id: number) {
        return this.actor.deleteDispatchRule(id);
    }

    async updateDispatchRule(ruleRequest: DispatchRuleDto): Promise<DispatchRuleDto> {
        if (ruleRequest.id === undefined) {
            throw new Error("Missing id on update rule request")
        }
        return this.actor.updateDispatchRule({
            ...ruleRequest,
            id: ruleRequest.id
        }) as Promise<DispatchRuleDto>
    }
}
