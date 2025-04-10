import { IDL } from "azle";

type arrIdlType = Parameters<typeof IDL.Vec>[0];

export const IDLPaged = (innerType: arrIdlType) => IDL.Record({
    Items: IDL.Vec(innerType),
    PageSize: IDL.Int32,
    PageNumber: IDL.Int32,
    TotalItems: IDL.Int32,
    TotalPages: IDL.Int32
})