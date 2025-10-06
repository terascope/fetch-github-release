export default {
    verbose: true,
    testEnvironment: 'node',
    setupFilesAfterEnv: ['jest-extended/all'],
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'html'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/**/coverage/**',
        '!<rootDir>/**/*.d.ts',
        '!<rootDir>/**/dist/**',
        '!<rootDir>/**/coverage/**'
    ],
    testMatch: [
        '<rootDir>/test/**/*-spec.{ts,js}',
        '<rootDir>/test/*-spec.{ts,js}',
    ],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    preset: 'ts-jest',
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        ignoreDirectories: ['dist'],
        availableExtensions: ['.js', '.ts', '.mjs']
    },
    transform: {
        '\\.[jt]sx?$': ['ts-jest',
            {
                tsconfig: './tsconfig.json',
                diagnostics: true,
                pretty: true,
                useESM: true
            }
        ]
    },
    testTimeout: 60 * 1000
};
