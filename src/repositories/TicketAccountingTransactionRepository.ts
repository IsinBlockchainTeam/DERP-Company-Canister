import { TicketAccountingTransaction, TicketLineItem, TicketLineItemGroup, TicketPaymentDetails, TicketTax } from "../models/types/accounting-transaction/TicketAccountingTransaction";
import { StableBTreeMap } from "azle";
import { StableTreeMapIds } from "./Utils";
import { AccountingTransactionAdditionalInfo, AccountingTransactionHeader, AccountingTransactionLineItemTax, AccountingTransactionTotals } from "../models/types/accounting-transaction/AccountingTransaction";


export class TicketAccountingTransactionRepository {
    private static _instance: TicketAccountingTransactionRepository;
    private _ticketTransactions = StableBTreeMap<string, TicketAccountingTransaction>(StableTreeMapIds.TicketAccountingTransaction);
    private constructor() { }
    static get instance() {
        if (!TicketAccountingTransactionRepository._instance) {
            TicketAccountingTransactionRepository._instance = new TicketAccountingTransactionRepository();
        }
        return TicketAccountingTransactionRepository._instance;
    }

    saveTicketAccountingTransaction(ticketAccountingTransaction: TicketAccountingTransaction): void {
        //TODO: check if the ticketAccountingTransaction is valid
        this._ticketTransactions.insert(ticketAccountingTransaction.Header.DLTERPId!, ticketAccountingTransaction);
    }

    getAllTicketAccountingTransactions(): TicketAccountingTransaction[] {
        return this._ticketTransactions.values().map(trx =>
            new TicketAccountingTransaction(
                trx.OperatorId,
                trx.OrderId,
                trx.Tax?.map(t => new TicketTax(t.Id, t.Amount, t.TypeCode, t.RateApplicablePercent)) ?? null,
                trx.LineItemGroups?.map(t => new TicketLineItemGroup(t.Id, t.Description)) ?? null,
                trx.LineItem?.map(t => new TicketLineItem(
                    t.ItemGroupId,
                    t.ItemCode,
                    t.Description,
                    t.Quantity,
                    t.UnitCode,
                    t.UnitPrice,
                    t.TotalInclTax,
                    t.TotalExclTax,
                    new AccountingTransactionLineItemTax(t.Tax.Amount, t.Tax.TypeCode, t.Tax.RateApplicablePercent)
                )) ?? null,
                trx.PaymentDetails?.map(pd => new TicketPaymentDetails(
                    pd.id,
                    pd.payerAddress,
                    pd.payeeAddress,
                    pd.paymentCurrencyAmount,
                    pd.issueDate,
                    pd.paymentType,
                    pd.paymentCurrency,
                    pd.exchangeRate,
                    pd.amount,
                    pd.externalId,
                    pd.externalUrl,
                )) ?? null,
                new AccountingTransactionAdditionalInfo(trx.AdditionalInformation?.Notes ? trx.AdditionalInformation.Notes[0] ?? null : null),
                new AccountingTransactionHeader(
                    trx.Header.DLTERPId!,
                    trx.Header.TotalAmount,
                    trx.Header.Source,
                    trx.Header.StoreId,
                    trx.Header.TypeCode,
                    trx.Header.TypeKey,
                    trx.Header.ExternalReferenceNumber,
                    trx.Header.IssueDate,
                    trx.Header.ValueDate,
                    trx.Header.Currency,
                    trx.Header.Status,
                    trx.Header.AccountingId,
                    trx.Header.AccountingDate,
                    trx.Header.Description,
                ),
                new AccountingTransactionTotals(trx.Totals.TotalTaxAmount, trx.Totals.TotalExclTax, trx.Totals.TotalInclTax),
            )
        );
    }

    getTicketAccountingTransactionById(id: string): TicketAccountingTransaction | null {
        const trx = this._ticketTransactions.get(id);
        if (!trx) return null;

        return new TicketAccountingTransaction(
                trx.OperatorId,
                trx.OrderId,
                trx.Tax?.map(t => new TicketTax(t.Id, t.Amount, t.TypeCode, t.RateApplicablePercent)) ?? null,
                trx.LineItemGroups?.map(t => new TicketLineItemGroup(t.Id, t.Description)) ?? null,
                trx.LineItem?.map(t => new TicketLineItem(
                    t.ItemGroupId,
                    t.ItemCode,
                    t.Description,
                    t.Quantity,
                    t.UnitCode,
                    t.UnitPrice,
                    t.TotalInclTax,
                    t.TotalExclTax,
                    new AccountingTransactionLineItemTax(t.Tax.Amount, t.Tax.TypeCode, t.Tax.RateApplicablePercent)
                )) ?? null,
                trx.PaymentDetails?.map(pd => new TicketPaymentDetails(
                    pd.id,
                    pd.payerAddress,
                    pd.payeeAddress,
                    pd.paymentCurrencyAmount,
                    pd.issueDate,
                    pd.paymentType,
                    pd.paymentCurrency,
                    pd.exchangeRate,
                    pd.amount,
                    pd.externalId,
                    pd.externalUrl,
                )) ?? null,
                new AccountingTransactionAdditionalInfo(trx.AdditionalInformation?.Notes ? trx.AdditionalInformation.Notes[0] ?? null : null),
                new AccountingTransactionHeader(
                    trx.Header.DLTERPId!,
                    trx.Header.TotalAmount,
                    trx.Header.Source,
                    trx.Header.StoreId,
                    trx.Header.TypeCode,
                    trx.Header.TypeKey,
                    trx.Header.ExternalReferenceNumber,
                    trx.Header.IssueDate,
                    trx.Header.ValueDate,
                    trx.Header.Currency,
                    trx.Header.Status,
                    trx.Header.AccountingId,
                    trx.Header.AccountingDate,
                    trx.Header.Description,
                ),
                new AccountingTransactionTotals(trx.Totals.TotalTaxAmount, trx.Totals.TotalExclTax, trx.Totals.TotalInclTax),
            )
    }
}
