import { IDL } from "azle";

export const IDLCreateDispatchRule = IDL.Record({
    ruleType: IDL.Text,
    statementItemIDs: IDL.Vec(IDL.Int32),
    accountingOperation: IDL.Text,
    validFrom: IDL.Opt(IDL.Text),
    validTo: IDL.Opt(IDL.Text),

    // TypeDispatchRule
    txType: IDL.Opt(IDL.Text),

    // StoreDispatchRule
    storeId: IDL.Opt(IDL.Int32),

    // GroupDispatchRule
    groupId: IDL.Opt(IDL.Text),

    // VatDispatchRule
    vatGroupId: IDL.Opt(IDL.Text),
})


export const IDLDispatchRule = IDL.Record({
    id: IDL.Int32,
    ruleType: IDL.Text,
    statementItemIDs: IDL.Vec(IDL.Int32),
    accountingOperation: IDL.Text,
    validFrom: IDL.Opt(IDL.Text),
    validTo: IDL.Opt(IDL.Text),

    // TypeDispatchRule
    txType: IDL.Opt(IDL.Text),

    // StoreDispatchRule
    storeId: IDL.Opt(IDL.Int32),

    // GroupDispatchRule
    groupId: IDL.Opt(IDL.Text),

    // VatDispatchRule
    vatGroupId: IDL.Opt(IDL.Text),
})
