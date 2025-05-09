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

export function isDefined<T>(value: T | undefined | null): value is T {
    return value !== undefined && value !== null;
}

export type StableBTreeMapType<K, V> = {
    containsKey: (key: K) => boolean;
    get: (key: K) => V | null;
    insert: (key: K, value: V) => void;
    isEmpty: () => boolean;
    items: (startIndex?: number, endIndex?: number) => [K, V][];
    keys: (startIndex?: number, endIndex?: number) => K[];
    len: () => bigint;
    remove: (key: K) => V | null;
    values: (startIndex?: number, length?: number) => V[];
}