import { IDL } from "azle";

// Define the InvoicePartyReference IDL type
const InvoicePartyReferenceObject = {
    id: IDL.Opt(IDL.Text),
    name: IDL.Opt(IDL.Text),
};

export const IDLInvoicePartyReference = IDL.Record(InvoicePartyReferenceObject);

const BaseDispatchRuleTypeObject = {
    ruleType: IDL.Text,

    // TypeDispatchRule
    txType: IDL.Opt(IDL.Text),

    // StoreDispatchRule
    storeId: IDL.Opt(IDL.Int32),

    // PaymentMethodDispatchRule
    paymentMethodId: IDL.Opt(IDL.Text),

    // GroupDispatchRule
    groupId: IDL.Opt(IDL.Text),

    // VatDispatchRule
    vatGroupId: IDL.Opt(IDL.Text),
    
    // CounterpartyDispatchRule
    counterpartName: IDL.Opt(IDL.Text),

    // MovementTypeDispatchRule
    movementType: IDL.Opt(IDL.Text),

    // IBANDispatchRule
    IBAN: IDL.Opt(IDL.Text),

    // CausalDispatchRule
    domainCode: IDL.Opt(IDL.Text),
    familyCode: IDL.Opt(IDL.Text),
    subFamilyCode: IDL.Opt(IDL.Text),

    // IssuerDispatchRule
    issuer: IDL.Opt(IDLInvoicePartyReference),
    
    // RecipientDispatchRule
    recipient: IDL.Opt(IDLInvoicePartyReference),
}

// This is the type of the child rules of a combined rule.
// It does not have target item IDs because they are inherited from the parent rule.
// It also does not have a validFrom and validTo because they are inherited from the parent rule.
// It also does not have an ID because it is not created in the database but embedded in the parent rule.
// It also does not have a accountingOperation because it is inherited from the parent rule.
const ChildDispatchRuleTypeObject = {
    ...BaseDispatchRuleTypeObject,
    contributes: IDL.Opt(IDL.Bool),
}

// This is the type of all dispatch rules.
const DispatchRuleTypeObject = {
    id: IDL.Int32,
    statementItemIDs: IDL.Vec(IDL.Int32),
    accountingOperation: IDL.Opt(IDL.Text),
    validFrom: IDL.Opt(IDL.Text),
    validTo: IDL.Opt(IDL.Text),

    ...BaseDispatchRuleTypeObject,
    rules: IDL.Opt(IDL.Vec(IDL.Record(ChildDispatchRuleTypeObject))),
}

// This is the type of the object used to create a dispatch rule.
const CreateDispatchRuleTypeObject = {
    statementItemIDs: IDL.Vec(IDL.Int32),
    accountingOperation: IDL.Opt(IDL.Text),
    validFrom: IDL.Opt(IDL.Text),
    validTo: IDL.Opt(IDL.Text),

    ...BaseDispatchRuleTypeObject,
    rules: IDL.Opt(IDL.Vec(IDL.Record(ChildDispatchRuleTypeObject))),
}


export const IDLCreateDispatchRule = IDL.Record(CreateDispatchRuleTypeObject)
export const IDLDispatchRule = IDL.Record(DispatchRuleTypeObject)