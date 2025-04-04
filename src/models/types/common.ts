type _WithIDLTypes<T> = {
    [K in keyof Required<T>]: undefined extends T[K] ?
    [_WithIDLTypes<NonNullable<T[K]>>] | []
    : _WithIDLTypes<T[K]>;
};

type ReplaceDate<T> = T extends Date
    ? string
    : T extends Array<infer U>
    ? ReplaceDate<U>[]
    : T extends object
    ? { [K in keyof T]: ReplaceDate<T[K]> }
    : T;


export type IDLTyped<T> = Exclude<_WithIDLTypes<ReplaceDate<T>>, keyof Function>;
