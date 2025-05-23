import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "../Utils";

export class RecipientDispatchRuleIndexRepository {
    private static _instance: RecipientDispatchRuleIndexRepository;

    // Recipient ID/Name -> dispatch rule ID
    private _recipientIdDispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.RecipientIdDispatchRuleIndex);
    private _recipientNameDispatchRuleIDs = StableBTreeMap<string, number[]>(StableTreeMapIds.RecipientNameDispatchRuleIndex);

    static get instance() {
        if (!RecipientDispatchRuleIndexRepository._instance) {
            RecipientDispatchRuleIndexRepository._instance = new RecipientDispatchRuleIndexRepository();
        }
        return RecipientDispatchRuleIndexRepository._instance;
    }

    private constructor() { }

    addRuleIdToRecipient(recipientId: string | undefined, recipientName: string | undefined, ruleId: number) {
        if (recipientId) {
            this.addRuleIdToRecipientId(recipientId, ruleId);
        }
        if (recipientName) {
            this.addRuleIdToRecipientName(recipientName, ruleId);
        }
    }

    removeRuleIdFromRecipient(recipientId: string | undefined, recipientName: string | undefined, ruleId: number) {
        if (recipientId) {
            this.removeRuleIdFromRecipientId(recipientId, ruleId);
        }
        if (recipientName) {
            this.removeRuleIdFromRecipientName(recipientName, ruleId);
        }
    }

    private addRuleIdToRecipientId(recipientId: string, ruleId: number) {
        const ruleIds = this._recipientIdDispatchRuleIDs.get(recipientId) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._recipientIdDispatchRuleIDs.insert(recipientId, ruleIds);
        }
    }

    private removeRuleIdFromRecipientId(recipientId: string, ruleId: number) {
        const ruleIds = this._recipientIdDispatchRuleIDs.get(recipientId) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._recipientIdDispatchRuleIDs.insert(recipientId, ruleIds);
        }
    }

    private addRuleIdToRecipientName(recipientName: string, ruleId: number) {
        const ruleIds = this._recipientNameDispatchRuleIDs.get(recipientName) || [];
        if (!ruleIds.includes(ruleId)) {
            ruleIds.push(ruleId);
            this._recipientNameDispatchRuleIDs.insert(recipientName, ruleIds);
        }
    }

    private removeRuleIdFromRecipientName(recipientName: string, ruleId: number) {
        const ruleIds = this._recipientNameDispatchRuleIDs.get(recipientName) || [];
        const index = ruleIds.indexOf(ruleId);
        if (index > -1) {
            ruleIds.splice(index, 1);
            this._recipientNameDispatchRuleIDs.insert(recipientName, ruleIds);
        }
    }

    getDispatchRuleIdsByRecipientId(recipientId: string): number[] {
        return this._recipientIdDispatchRuleIDs.get(recipientId) || [];
    }

    getDispatchRuleIdsByRecipientName(recipientName: string): number[] {
        return this._recipientNameDispatchRuleIDs.get(recipientName) || [];
    }
} 