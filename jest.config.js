module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      '^vscode$': '<rootDir>/tests/__mocks__/vscode.js',
    }
  };