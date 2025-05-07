import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { createActor } from "../declarations/dlterp_company";
import { DispatchRule, DispatchRuleDto } from "../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleEntityMapper } from "../service/DispatchRuleEntityMapper";

export class DispatchRulesClient {
    private readonly actor: ActorSubclass<_SERVICE>

    constructor(serverAddress: string, canisterId: string) {
        const agent = HttpAgent.createSync({ host: serverAddress })
        this.actor = createActor(canisterId, { agent })
    }

    async createDispatchRule(rule: DispatchRule): Promise<DispatchRule> {
        const created = await this.actor.createDispatchRule(rule.toDto()) as DispatchRuleDto
        return DispatchRuleEntityMapper.fromDto(created)
    }
    
    async createDispatchRules(rules: DispatchRule[]): Promise<DispatchRule[]> {
        const chunks = rules.reduce((acc, rule, index) => {
            const chunkIndex = Math.floor(index / 100);
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = [];
            }
            acc[chunkIndex].push(rule.toDto());
            return acc;
        }, [] as DispatchRuleDto[][]);

        const result: DispatchRule[] = [];
        for (const chunk of chunks) {
            const createdRules = await this.actor.createDispatchRules(chunk) as DispatchRuleDto[];
            result.push(...createdRules.map(DispatchRuleEntityMapper.fromDto));
        }

        return result;
    }

    async getDispatchRules(): Promise<DispatchRule[]> {
        return (await this.actor.getDispatchRules() as DispatchRuleDto[]).map(DispatchRuleEntityMapper.fromDto);
    }

    async deleteDispatchRule(id: number) {
        return this.actor.deleteDispatchRule(id);
    }

    async updateDispatchRule(ruleRequest: DispatchRule): Promise<DispatchRule> {
        if (ruleRequest.id === undefined) {
            throw new Error("Missing id on update rule request")
        }
        const updated = await this.actor.updateDispatchRule(ruleRequest.toDto()) as DispatchRuleDto
        return DispatchRuleEntityMapper.fromDto(updated)
    }
}
