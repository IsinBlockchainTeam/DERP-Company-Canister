import type { Config } from 'jest';

const config: Config = {
    watch: false,
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    globalSetup: '<rootDir>/global-setup.ts',
    globalTeardown: '<rootDir>/global-teardown.ts',
    testTimeout: 30_000,
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json' // percorso al tuo tsconfig specifico
        }
    }
};

export default config;