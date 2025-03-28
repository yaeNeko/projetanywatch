import { jest } from '@jest/globals';

// Global test setup
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});