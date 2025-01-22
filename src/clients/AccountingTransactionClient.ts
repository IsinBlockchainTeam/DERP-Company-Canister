import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { createActor } from "../declarations/dlterp_company";
import { _SERVICE } from "../declarations/dlterp_company/dlterp_company.did";
import { CreateTicketAccountingTransactionDto } from "../models/types/accounting-transaction/TicketAccountingTransactionDto";
import { TicketAccountingTransaction } from "../models/types/accounting-transaction/TicketAccountingTransaction";

export class AccountingTransactionClient {
    private readonly actor: ActorSubclass<_SERVICE>

    constructor(serverAddress: string, canisterId: string) {
        const agent = HttpAgent.createSync({ host: serverAddress })
        // TODO: remove in prod, security
        agent.fetchRootKey()
        this.actor = createActor(canisterId, { agent })
    }

    // TODO:
    //  Move conversion to ICP types in the lib
    async storeAccountingTransaction(trx: CreateTicketAccountingTransactionDto) {
        return this.actor.storeTicketAccountingTransaction(trx);
    }

    async storeAccountingTransactions(trxs: CreateTicketAccountingTransactionDto[]) {
        for(const trx of trxs) {
            console.log("Before controller: ", trx);
        }
        return this.actor.storeTicketAccountingTransactions(trxs);
    }

    async listAccountingTransactions() {
        const transactions = await this.actor.getAllTicketAccountingTransactions();
        return transactions.map(trx => TicketAccountingTransaction.fromDto(trx as CreateTicketAccountingTransactionDto));
    }
}
