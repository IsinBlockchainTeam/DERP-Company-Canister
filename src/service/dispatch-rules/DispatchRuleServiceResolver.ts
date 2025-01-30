import { AccountingTransaction } from "../../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRule, DispatchRuleDto } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { DispatchRuleHandler } from "./DispatchRuleHandler";
import { GroupDispatchRuleHandler } from "./group/GroupDispatchRuleHandler";
import { GroupDispatchRuleService } from "./group/GroupDispatchRuleService";
import { IDispatchRuleService } from "./IDispatchRuleService";
import { TypeDispatchRuleHandler } from "./type/TypeDispatchRuleHandler";
import { TypeDispatchRuleService } from "./type/TypeDistpatchRuleService";
import { VatGroupDispatchRuleHandler } from "./vat-group/VatGroupDispatchRuleHandler";
import { VatGroupDispatchRuleService } from "./vat-group/VatGroupDispatchRuleService";

export abstract class DispatchRuleServiceResolver {
    static service(rule: Partial<DispatchRule> & Pick<DispatchRule, 'ruleType'>): IDispatchRuleService<DispatchRule> {
        switch(rule.ruleType) {
            case DispatchRuleType.TYPE:
                return new TypeDispatchRuleService();
            case DispatchRuleType.GROUP:
                return new GroupDispatchRuleService();
            case DispatchRuleType.VAT_GROUP:
                return new VatGroupDispatchRuleService();
        }
    }

    static handler(rule: Partial<DispatchRule> & Pick<DispatchRule, 'ruleType'>): DispatchRuleHandler<DispatchRule, AccountingTransaction> {
        switch(rule.ruleType) {
            case DispatchRuleType.TYPE:
                return new TypeDispatchRuleHandler();
            case DispatchRuleType.GROUP:
                return new GroupDispatchRuleHandler();
            case DispatchRuleType.VAT_GROUP:
                return new VatGroupDispatchRuleHandler();
        }
    }
}
