module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      '^vscode$': '<rootDir>/src/tests/__mocks__/vscode.js',
    }
  };