import { Octokit } from '@octokit/core';
import { createOctokitClient } from '../../../src/services/github/client';
import { createGithubAccessToken } from '../../../src/services/api/endpoints';

const path = 'services/github/client';

const mockedOctokit = { test: 'some-value' };

jest.mock('../../../src/services/api/endpoints');
jest.mock('@octokit/core', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return mockedOctokit;
    })
  };
});

describe(path, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('createOctokitClient', () => {
    it('should init octokit client with `createNewAccessToken` value', async () => {
      const appToken = 'app-token:456';
      const accessToken = '1-2-3-token';

      (createGithubAccessToken as jest.Mock).mockReturnValue({ accessToken });

      const octokitClient = await createOctokitClient(appToken);

      expect(createGithubAccessToken).toBeCalledTimes(1);
      expect(createGithubAccessToken).toBeCalledWith({ appToken });

      expect(Octokit).toBeCalledTimes(1);
      expect(Octokit).toBeCalledWith({ auth: accessToken });

      expect(octokitClient).toBe(mockedOctokit);
    });

    it('should init octokit client with `githubToken` value', async () => {
      const githubToken = 'github-token:123';

      const octokitClient = await createOctokitClient('', githubToken);

      expect(createGithubAccessToken).not.toHaveBeenCalled();

      expect(Octokit).toBeCalledTimes(1);
      expect(Octokit).toBeCalledWith({ auth: githubToken });

      expect(octokitClient).toBe(mockedOctokit);
    });

    it('should throw exception if any of tokens passed', async () => {
      try {
        await createOctokitClient('');
        fail('getCoverageFromFile should throw an error');
      } catch (err) {
        expect(err.message).toBe(
          'Either Application or Github token is required to create Octokit client'
        );
        expect(createGithubAccessToken).not.toHaveBeenCalled();
      }
    });
  });
});
