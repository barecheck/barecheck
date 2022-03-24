import mockAxios from 'jest-mock-axios';
import {
  authProject,
  createCoverageMetric,
  coverageMetrics,
  createGithubAccessToken
} from '../../../src/services/api/endpoints';

const path = 'services/api/endpoints';

jest.mock('axios');

describe(path, () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('authProject', () => {
    it('should call axios post with proper params', async () => {
      const apiKey = 'github-token:123';
      const accessToken = '1-2-3-token';
      const mutationResponse = {
        data: {
          data: {
            authProject: {
              accessToken
            }
          }
        }
      };
      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      await authProject({ apiKey });

      expect(mockAxios.post).toBeCalledTimes(1);

      const [requestPath, body, headers] = mockAxios.post.mock.calls[0];
      expect(requestPath).toBe('https://barecheck.com/api/graphql');
      expect(body.variables).toMatchObject({ apiKey });
      expect(headers).toMatchObject({
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should return data with token from response', async () => {
      const apiKey = 'github-token:123';
      const accessToken = '1234';

      const mutationResponse = {
        data: {
          data: {
            authProject: {
              accessToken
            }
          }
        }
      };

      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      const res = await authProject({ apiKey });

      expect(mockAxios.post).toBeCalledTimes(1);
      expect(res).toBe(mutationResponse.data.data.authProject);
    });

    it("should throw error once mutation doesn't have succes:True", async () => {
      const apiKey = 'github-token:123';

      const mutationResponse = {
        data: {
          data: {
            authProject: {
              errors: []
            }
          }
        }
      };

      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      try {
        await authProject({ apiKey });
        fail('createGithubAccessToken should throw an error');
      } catch {
        expect(mockAxios.post).toBeCalledTimes(1);
      }
    });

    it('should throw error once there is no data in the response', async () => {
      const apiKey = 'github-token:123';

      const mutationResponse = {
        errors: ['some error']
      };

      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      try {
        await authProject({ apiKey });
        fail('createGithubAccessToken should throw an error');
      } catch {
        expect(mockAxios.post).toBeCalledTimes(1);
      }
    });
  });

  describe('createCoverageMetric', () => {
    it('should call axios post with proper params', async () => {
      const accessToken = '1234';

      const projectId = 123;
      const ref = 'master';
      const sha = 'e2e2e2';
      const totalCoverage = 93;

      const mutationResponse = {
        data: {
          data: {
            createCoverageMetric: {
              projectId
            }
          }
        }
      };
      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      await createCoverageMetric(accessToken, {
        projectId,
        ref,
        sha,
        totalCoverage
      });

      expect(mockAxios.post).toBeCalledTimes(1);

      const [requestPath, body, headers] = mockAxios.post.mock.calls[0];
      expect(requestPath).toBe('https://barecheck.com/api/graphql');
      expect(body.variables).toMatchObject({
        projectId,
        ref,
        sha,
        totalCoverage
      });
      expect(headers).toMatchObject({
        headers: {
          'Content-Type': 'application/json',
          'auth-provider': 'custom',
          authorization: `Bearer ${accessToken}`
        }
      });
    });

    it('should throw error once there is no data in the response', async () => {
      const accessToken = '1234';

      const projectId = 123;
      const ref = 'master';
      const sha = 'e2e2e2';
      const totalCoverage = 93;

      const mutationResponse = {
        errors: ['some error']
      };

      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      try {
        await createCoverageMetric(accessToken, {
          projectId,
          ref,
          sha,
          totalCoverage
        });
        fail('createGithubAccessToken should throw an error');
      } catch {
        expect(mockAxios.post).toBeCalledTimes(1);
      }
    });
  });

  describe('coverageMetrics', () => {
    it('should call axios post with proper params', async () => {
      const accessToken = '1234';

      const projectId = 123;
      const ref = 'master';
      const sha = 'e2e2e2';
      const totalCoverage = 93;

      const queryResponse = {
        data: {
          data: {
            coverageMetrics: {
              ref,
              sha,
              projectId,
              totalCoverage
            }
          }
        }
      };

      mockAxios.post.mockResolvedValueOnce(queryResponse);

      const actualRes = await coverageMetrics(accessToken, {
        projectId,
        ref
      });

      const [requestPath, body, headers] = mockAxios.post.mock.calls[0];
      expect(requestPath).toBe('https://barecheck.com/api/graphql');
      expect(body.variables).toMatchObject({ projectId, ref });
      expect(headers).toMatchObject({
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(actualRes).toBe(queryResponse.data.data.coverageMetrics);
    });

    it('should return null from api', async () => {
      const accessToken = '1234';

      const projectId = 123;
      const ref = 'master';

      const queryResponse = {
        data: {
          data: null
        }
      };
      mockAxios.post.mockResolvedValueOnce(queryResponse);

      const actualRes = await coverageMetrics(accessToken, {
        projectId,
        ref
      });

      expect(mockAxios.post).toBeCalledTimes(1);
      expect(actualRes).toBeNull();
    });
  });

  describe('createGithubAccessToken', () => {
    it('should call axios post with proper params', async () => {
      const accessToken = '1234';
      const appToken = 'app-token-1';

      const mutationResponse = {
        data: {
          data: {
            createGithubAccessToken: {
              accessToken
            }
          }
        }
      };
      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      await createGithubAccessToken({
        appToken
      });

      expect(mockAxios.post).toBeCalledTimes(1);

      const [requestPath, body, headers] = mockAxios.post.mock.calls[0];
      expect(requestPath).toBe('https://barecheck.com/api/graphql');
      expect(body.variables).toMatchObject({
        appToken
      });
      expect(headers).toMatchObject({
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should throw error once there is no data in the response', async () => {
      const appToken = 'app-token-1';

      const mutationResponse = {
        errors: ['some error']
      };

      mockAxios.post.mockResolvedValueOnce(mutationResponse);

      try {
        await createGithubAccessToken({
          appToken
        });
        fail('createGithubAccessToken should throw an error');
      } catch {
        expect(mockAxios.post).toBeCalledTimes(1);
      }
    });
  });
});
