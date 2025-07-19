/** @type {import('jest').Config} */
module.exports = {
  // Preset para TypeScript
  preset: "ts-jest",
  testEnvironment: "node",

  // Root directories
  roots: ["<rootDir>/src"],

  // Test patterns
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],

  // Transform files
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts",
    "!src/index.ts", // Re-export file
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Module resolution
  moduleNameMapper: {
    "^globals$": "<rootDir>/src/globals",
    "^interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^decorators/(.*)$": "<rootDir>/src/decorators/$1",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],

  // Clear mocks
  clearMocks: true,

  // Verbose output
  verbose: true,
}
