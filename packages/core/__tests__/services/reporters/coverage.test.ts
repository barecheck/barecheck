import { getCoverageReportBody } from '../../../src/services/reporters/coverage';

const path = 'services/reporters/coverage';

const request = jest.fn();

jest.mock('../../../src/services/api/endpoints');
jest.mock('@octokit/core', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request
      };
    })
  };
});

describe(path, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCoverageReportBody', () => {
    it('should render report body with uncovered lines', async () => {
      const changedFiles = [
        {
          file: 'test.js',
          lines: [1, 10],
          url: 'https://github/coverage/test.js'
        },
        {
          file: 'test.js',
          lines: [50],
          url: 'https://github/coverage/test.js'
        },
        {
          file: 'test2.js',
          lines: [[1, 5], 10],
          url: 'https://github/coverage/test.js'
        }
      ];
      const title = 'Barecheck APP';
      const coverageDiff = -2;
      const totalCoverage = 80;
      const body = getCoverageReportBody({
        changedFiles,
        title,
        coverageDiff,
        totalCoverage
      });
      expect(body).toMatchSnapshot();
    });

    it('should render report body with full coverage', async () => {
      const changedFiles = [];
      const title = 'Barecheck APP';
      const coverageDiff = 10;
      const totalCoverage = 80;
      const body = getCoverageReportBody({
        changedFiles,
        title,
        coverageDiff,
        totalCoverage
      });
      expect(body).toMatchSnapshot();
    });
  });
});
