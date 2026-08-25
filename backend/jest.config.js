module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/tests/**']
};
