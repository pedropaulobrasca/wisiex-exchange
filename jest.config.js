/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/server.ts",
  ],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\.ts?$": ["ts-jest",{}],
  },
  testMatch: ["**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};