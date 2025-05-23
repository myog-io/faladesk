module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testMatch: ['<rootDir>/../apps/frontend/tests/**/*.(test|spec).tsx?'],
};
