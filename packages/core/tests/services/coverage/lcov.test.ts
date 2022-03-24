const lcov = require('lcov-parse');

import {
  parseLcovFileData,
  calculatePercentage,
  groupLcovData
} from '../../../src/services/coverage/lcov';

const path = 'services/coverage/lcov';

jest.mock('lcov-parse');

describe(path, () => {
  describe('parseLcovFileData', () => {
    it('should resolve promise with lcov result', async () => {
      const lcovRes = { test: 2 };
      const lcovFileData = 'some lcov file data';

      (lcov as jest.Mock).mockImplementation((data, callback) =>
        callback(null, lcovRes)
      );

      const actualRes = await parseLcovFileData(lcovFileData);
      expect(actualRes).toBe(lcovRes);
    });

    it('should reject error from lcov lib', async () => {
      const lcovFileData = 'some lcov file data';
      const expectedErr = new Error('something went wrong');

      (lcov as jest.Mock).mockImplementation((data, callback) =>
        callback(expectedErr, null)
      );

      try {
        await parseLcovFileData(lcovFileData);
        fail('exception should be thrown');
      } catch (err) {
        expect(err).toBe(expectedErr);
      }
    });
  });

  describe('calculatePercentage', () => {
    it('should return calculatePercentage based on received lines', () => {
      const parsedLcovFile = [
        {
          lines: {
            hit: 5,
            found: 10,
            details: []
          },
          functions: {
            hit: 0,
            found: 0,
            details: []
          },
          branches: {
            hit: 0,
            found: 0,
            details: []
          },
          title: 'test 1',
          file: 'test1.js'
        },
        {
          lines: {
            hit: 5,
            found: 10,
            details: []
          },
          functions: {
            hit: 0,
            found: 0,
            details: []
          },
          branches: {
            hit: 0,
            found: 0,
            details: []
          },
          title: 'test 2',
          file: 'test2.js'
        },
        {
          lines: {
            hit: 10,
            found: 20,
            details: []
          },
          functions: {
            hit: 0,
            found: 0,
            details: []
          },
          branches: {
            hit: 0,
            found: 0,
            details: []
          },
          title: 'test 3',
          file: 'test3.js'
        }
      ];

      const res = calculatePercentage(parsedLcovFile);

      expect(res).toBe(50);
    });

    it('result should be fixed to 2 symbols after comma', () => {
      const functions = {
        hit: 0,
        found: 0,
        details: []
      };
      const branches = {
        hit: 0,
        found: 0,
        details: []
      };
      const parsedLcovFile = [
        {
          lines: {
            hit: 3,
            found: 10,
            details: []
          },
          functions,
          branches,
          title: 'test 1',
          file: 'test1.js'
        },
        {
          lines: {
            hit: 23,
            found: 51,
            details: []
          },
          functions,
          branches,
          title: 'test 2',
          file: 'test2.js'
        }
      ];

      const res = calculatePercentage(parsedLcovFile);

      expect(res).toBe(42.62);
    });
  });

  describe('groupLcovData', () => {
    it('should return uncovered lines with file', () => {
      const lines = {
        found: 16,
        hit: 10,
        details: [
          { line: 1, hit: 1 },
          { line: 3, hit: 1 },
          { line: 4, hit: 0 },
          { line: 5, hit: 0 },
          { line: 6, hit: 0 },
          { line: 7, hit: 0 },
          { line: 8, hit: 0 },
          { line: 10, hit: 0 },
          { line: 15, hit: 1 },
          { line: 16, hit: 2 },
          { line: 17, hit: 2 },
          { line: 18, hit: 2 },
          { line: 19, hit: 5 },
          { line: 20, hit: 5 },
          { line: 23, hit: 2 },
          { line: 26, hit: 1 }
        ]
      };
      const lcovData = [
        {
          lines,
          branches: lines,
          functions: lines,
          title: 'src/lcov.js',
          file: 'src/lcov.js'
        }
      ];

      const res = groupLcovData(lcovData);

      expect(res).toStrictEqual([
        {
          file: 'src/lcov.js',
          lines: [[4, 8], 10]
        }
      ]);
    });

    it('should return empty array', () => {
      const lcovData = [];

      const res = groupLcovData(lcovData);

      expect(res.length).toBe(0);
    });
  });
});
