import { Serializable, stableJson } from "azle";
import { BankAccountingTransaction } from "../models/types/accounting-transaction/BankAccountingTransaction";
import { BankAccountingTransactionDTO } from "../models/types/accounting-transaction/BankAccountingTransactionDto";

export class BankAccountingTransactionSerializer implements Serializable {
    toBytes(data: any) {
        const ticket = data as BankAccountingTransaction;
        const dto = ticket.toDto();

        return stableJson.toBytes(dto);
    }

    fromBytes(bytes: Uint8Array) {
        const dto = stableJson.fromBytes(bytes) as BankAccountingTransactionDTO;
        return BankAccountingTransaction.fromDto(dto);
    }
}
