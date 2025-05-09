// Mock implementation of the azle module for testing that maintains state
export const StableBTreeMap = jest.fn().mockImplementation(() => {
  const storage = new Map();
  
  return {
    get: jest.fn().mockImplementation((key) => storage.get(JSON.stringify(key)) || null),
    insert: jest.fn().mockImplementation((key, value) => {
      storage.set(JSON.stringify(key), value);
      return undefined;
    }),
    keys: jest.fn().mockImplementation(() => Array.from(storage.keys()).map(k => JSON.parse(k))),
    values: jest.fn().mockImplementation(() => Array.from(storage.values())),
    // For easier testing and debugging
    _getStorage: () => storage
  };
});

export const stableJson = {
  // These functions simply pass through the values in tests
  toBytes: jest.fn().mockImplementation((value) => JSON.stringify(value)),
  fromBytes: jest.fn().mockImplementation((bytes) => JSON.parse(bytes.toString())),
};
