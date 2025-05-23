import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class IssuerDispatchRuleIndexRepository {
    private static _instance: IssuerDispatchRuleIndexRepository;

    // Issuer ID/Name -> dispatch rule ID
    private _issuerIdDispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.IssuerIdDispatchRuleIndex);
    private _issuerNameDispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.IssuerNameDispatchRuleIndex);

    static get instance() {
        if (!IssuerDispatchRuleIndexRepository._instance) {
            IssuerDispatchRuleIndexRepository._instance = new IssuerDispatchRuleIndexRepository();
        }
        return IssuerDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToIssuer(issuerId: string | undefined, issuerName: string | undefined, ruleId: number) {
        if (issuerId) {
            this.addRuleIdToIssuerId(issuerId, ruleId);
        }
        if (issuerName) {
            this.addRuleIdToIssuerName(issuerName, ruleId);
        }
    }

    removeRuleIdFromIssuer(issuerId: string | undefined, issuerName: string | undefined, ruleId: number) {
        if (issuerId) {
            this.removeRuleIdFromIssuerId(issuerId, ruleId);
        }
        if (issuerName) {
            this.removeRuleIdFromIssuerName(issuerName, ruleId);
        }
    }

    private addRuleIdToIssuerId(issuerId: string, ruleId: number) {
        const ruleIds = this._issuerIdDispatchRuleIDs.get(issuerId) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._issuerIdDispatchRuleIDs.insert(issuerId, ruleIds);
        }
    }

    private removeRuleIdFromIssuerId(issuerId: string, ruleId: number) {
        const ruleIds = this._issuerIdDispatchRuleIDs.get(issuerId) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._issuerIdDispatchRuleIDs.insert(issuerId, ruleIds);
        }
    }

    private addRuleIdToIssuerName(issuerName: string, ruleId: number) {
        const ruleIds = this._issuerNameDispatchRuleIDs.get(issuerName) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._issuerNameDispatchRuleIDs.insert(issuerName, ruleIds);
        }
    }

    private removeRuleIdFromIssuerName(issuerName: string, ruleId: number) {
        const ruleIds = this._issuerNameDispatchRuleIDs.get(issuerName) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._issuerNameDispatchRuleIDs.insert(issuerName, ruleIds);
        }
    }

    getDispatchRuleIdsByIssuerId(issuerId: string): number[] {
        return this._issuerIdDispatchRuleIDs.get(issuerId) || [];
    }

    getDispatchRuleIdsByIssuerName(issuerName: string): number[] {
        return this._issuerNameDispatchRuleIDs.get(issuerName) || [];
    }
} 