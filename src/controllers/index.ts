import CompanyInfoController from "./CompanyInfoController";
import AccountingTransactionController from "./AccountingTransactionController";
import StatementItemsController from './StatementItemsController';

export default class {
    _companyInfoController = new CompanyInfoController()
    _accountingTransactionController = new AccountingTransactionController()
    _statementItemsController = new StatementItemsController()
}
