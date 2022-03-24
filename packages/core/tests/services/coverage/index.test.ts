import { parseLcovFile } from '../../../src/services/coverage';

import * as fs from 'fs';

import {
  parseLcovFileData,
  calculatePercentage,
  groupLcovData
} from '../../../src/services/coverage/lcov';

const path = 'services/coverage';

jest.mock('fs');

jest.mock('../../../src/services/coverage/lcov');

describe(path, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('parseLcovFile', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should coverage and parsed lcov data', async () => {
      const coverageFilePath = 'dir/file.lcov';
      const fileRaw = 'some file data';

      const expecteLcovData = [
        {
          test: 1
        }
      ];

      const expectedData = [
        {
          test: 3
        }
      ];
      const expectedPercentage = 50;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileRaw);
      (parseLcovFileData as jest.Mock).mockReturnValue(expecteLcovData);
      (groupLcovData as jest.Mock).mockReturnValue(expectedData);
      (calculatePercentage as jest.Mock).mockReturnValue(expectedPercentage);

      const { lcovData, data, percentage } = await parseLcovFile(coverageFilePath);

      expect(lcovData).toBe(expecteLcovData);
      expect(data).toBe(expectedData);
      expect(percentage).toBe(expectedPercentage);
    });

    it('should throw exception if there is no data inside file', async () => {
      const coverageFilePath = 'dir/file.lcov';
      (fs.readFileSync as jest.Mock).mockReturnValue('');

      try {
        await parseLcovFile(coverageFilePath);
        fail('getCoverageFromFile should throw an error');
      } catch (err) {
        expect(err.message).toBe(
          "No coverage report found at 'dir/file.lcov', exiting..."
        );
        expect(parseLcovFileData).not.toHaveBeenCalled();
        expect(calculatePercentage).not.toHaveBeenCalled();
      }
    });
  });
});
