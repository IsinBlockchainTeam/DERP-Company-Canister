import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class BankCausalDispatchRuleIndexRepository {
    private static _instance: BankCausalDispatchRuleIndexRepository;

    // Domain/Family/SubFamily -> dispatch rule ID
    private _domainDispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.BankCausalDomainDispatchRuleIndex);
    private _familyDispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.BankCausalFamilyDispatchRuleIndex);
    private _subFamilyDispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.BankCausalSubFamilyDispatchRuleIndex);

    static get instance() {
        if (!BankCausalDispatchRuleIndexRepository._instance) {
            BankCausalDispatchRuleIndexRepository._instance = new BankCausalDispatchRuleIndexRepository();
        }
        return BankCausalDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToCodes(domainCode: string, familyCode: string, subFamilyCode: string, ruleId: number) {
        this.addRuleIdToDomain(domainCode, ruleId);
        this.addRuleIdToFamily(familyCode, ruleId);
        this.addRuleIdToSubFamily(subFamilyCode, ruleId);
    }

    removeRuleIdFromCodes(domainCode: string, familyCode: string, subFamilyCode: string, ruleId: number) {
        this.removeRuleIdFromDomain(domainCode, ruleId);
        this.removeRuleIdFromFamily(familyCode, ruleId);
        this.removeRuleIdFromSubFamily(subFamilyCode, ruleId);
    }

    private addRuleIdToDomain(domainCode: string, ruleId: number) {
        const ruleIds = this._domainDispatchRuleIDs.get(domainCode) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._domainDispatchRuleIDs.insert(domainCode, ruleIds);
        }
    }

    private removeRuleIdFromDomain(domainCode: string, ruleId: number) {
        const ruleIds = this._domainDispatchRuleIDs.get(domainCode) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._domainDispatchRuleIDs.insert(domainCode, ruleIds);
        }
    }

    private addRuleIdToFamily(familyCode: string, ruleId: number) {
        const ruleIds = this._familyDispatchRuleIDs.get(familyCode) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._familyDispatchRuleIDs.insert(familyCode, ruleIds);
        }
    }

    private removeRuleIdFromFamily(familyCode: string, ruleId: number) {
        const ruleIds = this._familyDispatchRuleIDs.get(familyCode) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._familyDispatchRuleIDs.insert(familyCode, ruleIds);
        }
    }

    private addRuleIdToSubFamily(subFamilyCode: string, ruleId: number) {
        const ruleIds = this._subFamilyDispatchRuleIDs.get(subFamilyCode) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._subFamilyDispatchRuleIDs.insert(subFamilyCode, ruleIds);
        }
    }

    private removeRuleIdFromSubFamily(subFamilyCode: string, ruleId: number) {
        const ruleIds = this._subFamilyDispatchRuleIDs.get(subFamilyCode) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._subFamilyDispatchRuleIDs.insert(subFamilyCode, ruleIds);
        }
    }

    getDispatchRuleIdsByDomain(domainCode: string): number[] {
        return this._domainDispatchRuleIDs.get(domainCode) || [];
    }

    getDispatchRuleIdsByFamily(familyCode: string): number[] {
        return this._familyDispatchRuleIDs.get(familyCode) || [];
    }

    getDispatchRuleIdsBySubFamily(subFamilyCode: string): number[] {
        return this._subFamilyDispatchRuleIDs.get(subFamilyCode) || [];
    }
} 