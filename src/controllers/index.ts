import CompanyInfoController from "./CompanyInfoController";
import AccountingTransactionController from "./AccountingTransactionController";
import StatementItemsController from './StatementItemsController';
import DispatchRulesController from "./DispatchRulesController";

export default class {
    _companyInfoController = new CompanyInfoController()
    _accountingTransactionController = new AccountingTransactionController()
    _statementItemsController = new StatementItemsController()
    _dispatchRulesController = new DispatchRulesController()
}
