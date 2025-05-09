/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': ['ts-jest', { 
            isolatedModules: true,
            tsconfig: 'tsconfig.test.json'
        }],
        '^.+\\.js$': 'ts-jest'
    },
    transformIgnorePatterns: ['/node_modules/(?!(azle)/)'], // Make sure azle is transformed
    testTimeout: 10000 // Increase test timeout to prevent hanging
};
