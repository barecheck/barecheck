import { Octokit } from '@octokit/core';
import {
  findComment,
  updateComment,
  createComment,
  createOrUpdateComment,
  getChangedFiles
} from '../../../src/services/github/endpoints';

const path = 'services/github/endpoints';

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
  describe('findComment', () => {
    it('should call octokit.request method with proper params', async () => {
      const repo = 'test-repo';
      const owner = 'test-owner';
      const searchBody = 'some comment to search';
      const issueNumber = 133;

      const mockedResponse = {
        data: [
          {
            body: searchBody + 'some other text'
          }
        ]
      };
      request.mockReturnValue(mockedResponse);

      const octokit = new Octokit();

      const res = await findComment(octokit, {
        repo,
        owner,
        issueNumber,
        searchBody
      });

      expect(res).toBe(mockedResponse.data[0]);
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
        {
          repo,
          owner,
          issue_number: issueNumber,
          per_page: 100
        }
      );
    });
  });

  describe('updateComment', () => {
    it('should call octokit.request method with proper params', async () => {
      const repo = 'test-repo';
      const owner = 'test-owner';
      const body = 'some comment to search';
      const commentId = 133;

      const mockedResponse = {
        data: {
          id: 'some-id-1',
          body
        }
      };
      request.mockReturnValue(mockedResponse);

      const octokit = new Octokit();

      const res = await updateComment(octokit, {
        repo,
        owner,
        commentId,
        body
      });

      expect(res).toBe(mockedResponse.data);
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
        {
          repo,
          owner,
          body,
          comment_id: commentId
        }
      );
    });
  });

  describe('createComment', () => {
    it('should call octokit.request method with proper params', async () => {
      const repo = 'test-repo';
      const owner = 'test-owner';
      const body = 'some comment to search';
      const issueNumber = 133;

      const mockedResponse = {
        data: {
          id: 'some-id-1',
          body
        }
      };
      request.mockReturnValue(mockedResponse);

      const octokit = new Octokit();

      const res = await createComment(octokit, {
        repo,
        owner,
        issueNumber,
        body
      });

      expect(res).toBe(mockedResponse.data);
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
        {
          repo,
          owner,
          issue_number: issueNumber,
          body
        }
      );
    });
  });

  describe('createOrUpdateComment', () => {
    it('should update comment if body was found', async () => {
      const repo = 'test-repo';
      const owner = 'test-owner';
      const searchBody = 'some comment to search';
      const body = 'some comment to search';
      const issueNumber = 133;

      const mockedFindCommentResponse = {
        data: [{ id: 'some-id-1', body: searchBody + 'random' }]
      };

      const mockedUpdateCommentResponse = {
        data: { id: 'some-id-2', body }
      };

      request
        .mockReturnValueOnce(mockedFindCommentResponse)
        .mockReturnValueOnce(mockedUpdateCommentResponse);

      const octokit = new Octokit();

      const res = await createOrUpdateComment(octokit, {
        repo,
        owner,
        issueNumber,
        body,
        searchBody
      });

      expect(res).toBe(mockedUpdateCommentResponse.data);
      expect(request).toBeCalledTimes(2);

      const [findCommentPath] = request.mock.calls[0];
      const [updateCommentPath] = request.mock.calls[1];

      expect(findCommentPath).toBe(
        'GET /repos/{owner}/{repo}/issues/{issue_number}/comments'
      );
      expect(updateCommentPath).toBe(
        'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}'
      );
    });

    it("should create comment if body wasn't found", async () => {
      const repo = 'test-repo';
      const owner = 'test-owner';
      const searchBody = 'some comment to search';
      const body = 'some comment to search';
      const issueNumber = 133;

      const mockedFindCommentResponse = {
        data: [{ id: 'some-id-1', body: 'random body' }]
      };

      const mockedUpdateCommentResponse = {
        data: { id: 'some-id-2', body }
      };

      request
        .mockReturnValueOnce(mockedFindCommentResponse)
        .mockReturnValueOnce(mockedUpdateCommentResponse);

      const octokit = new Octokit();

      const res = await createOrUpdateComment(octokit, {
        repo,
        owner,
        issueNumber,
        body,
        searchBody
      });

      expect(res).toBe(mockedUpdateCommentResponse.data);
      expect(request).toBeCalledTimes(2);

      const [findCommentPath] = request.mock.calls[0];
      const [updateCommentPath] = request.mock.calls[1];

      expect(findCommentPath).toBe(
        'GET /repos/{owner}/{repo}/issues/{issue_number}/comments'
      );
      expect(updateCommentPath).toBe(
        'POST /repos/{owner}/{repo}/issues/{issue_number}/comments'
      );
    });
  });

  describe('getChangedFiles', () => {
    it('should call octokit.request method with proper params', async () => {
      const repo = 'test-repo';
      const owner = 'test-owner';
      const pullNumber = 133;

      const mockedResponse = {
        data: {
          id: 'some-id-1',
          pullNumber
        }
      };
      request.mockReturnValue(mockedResponse);

      const octokit = new Octokit();

      const res = await getChangedFiles(octokit, {
        repo,
        owner,
        pullNumber
      });

      expect(res).toBe(mockedResponse.data);
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
        {
          repo,
          owner,
          pull_number: pullNumber,
          per_page: 100
        }
      );
    });
  });
});
