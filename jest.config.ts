import { createDefaultPreset, JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  ...createDefaultPreset(),
};

export default jestConfig;
