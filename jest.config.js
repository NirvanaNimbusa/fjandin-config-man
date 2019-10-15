module.exports = {
    rootDir: __dirname,
    verbose: false,
    silent: false,
    browser: false,
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['text-summary', 'lcov'],
    collectCoverageFrom: ['<rootDir>/src/**/*', '!<rootDir>/**/*.d.ts', '!<rootDir>/**/*.test.ts'],
    coverageDirectory: '<rootDir>/coverage',
    modulePaths: ['<rootDir>/src/'],
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    }
    // setupFiles: ['<rootDir>/jest/setup.ts'],
    // testRegex: '/src/.*$',
    // testURL: 'http://localhost/',
    // testPathIgnorePatterns: [],
    // resetMocks: false,
    // moduleNameMapper: {
    //     'jest/(.*)': '<rootDir>/jest/$1'
    // }
}
