const path = require('path');

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    resolveJsonModule: true,
    root: path.resolve(__dirname, './test'),
    testMatch: [
        '<rootDir>/test/**/*.ts'
    ],
    testPathIgnorePatterns: [
        '/node/modules'
    ],
    collectCoverage: true,
    coverageDirectory: './coverage'
};
