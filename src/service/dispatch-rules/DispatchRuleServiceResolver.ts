import { AccountingTransaction } from "../../models/types/accounting-transaction/AccountingTransaction";
import { DispatchRule } from "../../models/types/dispatch-rules/DispatchRule";
import { DispatchRuleType } from "../../models/types/dispatch-rules/DispatchRuleTypes";
import { BankAccountDispatchRuleHandler } from "./bank-account/BankAccountDispatchRuleHandler";
import { BankAccountDispatchRuleService } from "./bank-account/BankAccountDispatchRuleService";
import { BankCausalDispatchRuleHandler } from "./bank-causal/BankCausalDispatchRuleHandler";
import { BankCausalDispatchRuleService } from "./bank-causal/BankCausalDispatchRuleService";
import { BankCounterpartDispatchRuleHandler } from "./bank-counterpart/BankCounterpartDispatchRuleHandler";
import { BankCounterpartDispatchRuleService } from "./bank-counterpart/BankCounterpartDispatchRuleService";
import { BankMovementTypeDispatchRuleHandler } from "./bank-movement-type/BankMovementTypeDispatchRuleHandler";
import { BankMovementTypeDispatchRuleService } from "./bank-movement-type/BankMovementTypeDispatchRuleService";
import { BaseDispatchRuleService } from "./BaseDispatchRuleService";
import { CombinedDispatchRuleHandler } from "./combined/CombinedDispatchRuleHandler";
import { CombinedDispatchRuleService } from "./combined/CombinedDispatchRuleService";
import { DispatchRuleHandler } from "./DispatchRuleHandler";
import { GroupDispatchRuleHandler } from "./group/GroupDispatchRuleHandler";
import { GroupDispatchRuleService } from "./group/GroupDispatchRuleService";
import { IDispatchRuleService } from "./IDispatchRuleService";
import { StoreDispatchRuleHandler } from "./store/StoreDispatchRuleHandler";
import { StoreDispatchRuleService } from "./store/StoreDispatchRuleService";
import { TypeDispatchRuleHandler } from "./type/TypeDispatchRuleHandler";
import { TypeDispatchRuleService } from "./type/TypeDistpatchRuleService";
import { VatGroupDispatchRuleHandler } from "./vat-group/VatGroupDispatchRuleHandler";
import { VatGroupDispatchRuleService } from "./vat-group/VatGroupDispatchRuleService";

export abstract class DispatchRuleServiceResolver {
    static service(rule: Partial<DispatchRule> & Pick<DispatchRule, 'ruleType'>): BaseDispatchRuleService<DispatchRule> {
        switch(rule.ruleType) {
            case DispatchRuleType.TYPE:
                return new TypeDispatchRuleService();
            case DispatchRuleType.GROUP:
                return new GroupDispatchRuleService();
            case DispatchRuleType.VAT_GROUP:
                return new VatGroupDispatchRuleService();
            case DispatchRuleType.STORE:
                return new StoreDispatchRuleService();
            case DispatchRuleType.BANK_ACCOUNT:
                return new BankAccountDispatchRuleService();
            case DispatchRuleType.BANK_COUNTERPART:
                return new BankCounterpartDispatchRuleService();
            case DispatchRuleType.BANK_MOVEMENT_TYPE:
                return new BankMovementTypeDispatchRuleService();
            case DispatchRuleType.BANK_CAUSAL:
                return new BankCausalDispatchRuleService();
            case DispatchRuleType.COMBINED:
                return new CombinedDispatchRuleService();
            // NEVER add a default statement. This will allow to notice a missing case.
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
            case DispatchRuleType.STORE:
                return new StoreDispatchRuleHandler();
            case DispatchRuleType.BANK_ACCOUNT:
                return new BankAccountDispatchRuleHandler();
            case DispatchRuleType.BANK_COUNTERPART:
                return new BankCounterpartDispatchRuleHandler();
            case DispatchRuleType.BANK_MOVEMENT_TYPE:
                return new BankMovementTypeDispatchRuleHandler();
            case DispatchRuleType.BANK_CAUSAL:
                return new BankCausalDispatchRuleHandler();
            case DispatchRuleType.COMBINED:
                return new CombinedDispatchRuleHandler();
            // NEVER add a default statement. This will allow to notice a missing case.
        }
    }
}
