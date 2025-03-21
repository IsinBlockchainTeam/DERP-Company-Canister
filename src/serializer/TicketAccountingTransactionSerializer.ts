import { Serializable, stableJson } from "azle";
import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { TicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";

export class TicketAccountingTransactionSerializer implements Serializable {
    toBytes(data: any) {
        const ticket = data as TicketAccountingTransaction;
        const dto = ticket.toDto();

        return stableJson.toBytes(dto);
    }

    fromBytes(bytes: Uint8Array) {
        const dto = stableJson.fromBytes(bytes) as TicketAccountingTransactionDto;
        return TicketAccountingTransaction.fromDto(dto);
    }
}
