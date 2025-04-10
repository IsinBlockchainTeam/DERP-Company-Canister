import { IDL } from "azle";

export const IDLPagedRequest = IDL.Record({
  PageSize: IDL.Int32,
  PageNumber: IDL.Int32,
});