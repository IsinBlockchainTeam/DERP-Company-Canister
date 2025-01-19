import { IDL } from "azle";

export const IDLCreateDispatchRule = IDL.Record({
    ruleType: IDL.Text,
    statementItemIDs: IDL.Vec(IDL.Int32),

    // TypeDispatchRule
    txType: IDL.Opt(IDL.Text),

    // GroupDispatchRule
    groupId: IDL.Opt(IDL.Text),
})

export const IDLDispatchRule = IDL.Record({
    id: IDL.Int32,
    ruleType: IDL.Text,
    statementItemIDs: IDL.Vec(IDL.Int32),

    // TypeDispatchRule
    txType: IDL.Opt(IDL.Text),

    // GroupDispatchRule
    groupId: IDL.Opt(IDL.Text),
})
