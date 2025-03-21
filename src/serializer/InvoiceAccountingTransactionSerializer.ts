import { Serializable, stableJson } from "azle";
import { InvoiceAccountingTransaction } from "../models/types/accounting-transaction/InvoiceAccountingTransaction";
import { InvoiceAccountingTransactionDTO } from "../models/types/accounting-transaction/InvoiceAccountingTransactionDto";

export class InvoiceAccountingTransactionSerializer implements Serializable {
    toBytes(data: any) {
        const ticket = data as InvoiceAccountingTransaction;
        const dto = ticket.toDto();

        return stableJson.toBytes(dto);
    }

    fromBytes(bytes: Uint8Array) {
        const dto = stableJson.fromBytes(bytes) as InvoiceAccountingTransactionDTO;
        return InvoiceAccountingTransaction.fromDto(dto);
    }
}
