import {IDL, query, update} from "azle";
import {Company, CreateCompanyDTO} from "../models/types/Company";
import {IDLCompany, IDLCreateCompany} from "../models/IDLs/Company";


class CompanyInfoController {

    companyInfo: Company | {} = {};

    @query([], IDLCompany)
    async getCompanyInfo(): Promise<Company | {}> {
        return this.companyInfo;
    }

    @update([IDLCreateCompany])
    setCompanyInfo(newCompanyInfo: CreateCompanyDTO): void {
        this.companyInfo = Company.fromDTO(newCompanyInfo);
    }

}

export default CompanyInfoController;