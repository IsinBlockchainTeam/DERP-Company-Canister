import { IDL, query, update } from 'azle';
import CompanyInfoController from "./CompanyInfoController";
import AccountingTransactionController from "./AccountingTransactionController";

export default class {
    _companyInfoController = new CompanyInfoController()
    _accountingTransactionController = new AccountingTransactionController()
}
