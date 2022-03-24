import { Octokit } from '@octokit/core';
export { createOctokitClient } from './client';

type TFindCommentParams = {
  repo: string;
  owner: string;
  issueNumber: number;
  searchBody: string;
};

type TUpdateCommentParams = {
  repo: string;
  owner: string;
  commentId: number;
  body: string;
};

type TCreateCommentParams = {
  repo: string;
  owner: string;
  issueNumber: number;
  body: string;
};

type TCreateUpdateCommentParams = {
  repo: string;
  owner: string;
  issueNumber: number;
  searchBody: string;
  body: string;
};

type TChangedFilesParams = {
  repo: string;
  owner: string;
  pullNumber: number;
};

export const findComment = async (
  octokit: Octokit,
  { repo, owner, issueNumber, searchBody }: TFindCommentParams
) => {
  const { data } = await octokit.request(
    'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      repo,
      owner,
      issue_number: issueNumber,
      per_page: 100
    }
  );

  const comment = data.find((comment) => comment.body.includes(searchBody));

  return comment;
};

export const updateComment = async (
  octokit: Octokit,
  { repo, owner, commentId, body }: TUpdateCommentParams
) => {
  const { data } = await octokit.request(
    'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
    {
      repo,
      owner,
      body,
      comment_id: commentId
    }
  );

  return data;
};

export const createComment = async (
  octokit: Octokit,
  { repo, owner, issueNumber, body }: TCreateCommentParams
) => {
  const { data } = await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      repo,
      owner,
      issue_number: issueNumber,
      body
    }
  );

  return data;
};

export const createOrUpdateComment = async (
  octokit: Octokit,
  { owner, repo, issueNumber, searchBody, body }: TCreateUpdateCommentParams
) => {
  const comment = await findComment(octokit, {
    owner,
    repo,
    issueNumber,
    searchBody
  });

  return comment
    ? updateComment(octokit, { owner, repo, commentId: comment.id, body })
    : createComment(octokit, { owner, repo, issueNumber, body });
};

/**
 * Returns first 100 files that were changed
 * TODO: decide if we need to show more than that in the details report
 *  */
export const getChangedFiles = async (
  octokit: Octokit,
  { repo, owner, pullNumber }: TChangedFilesParams
) => {
  const changedFiles = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
    {
      repo,
      owner,
      pull_number: pullNumber,
      per_page: 100
    }
  );

  return changedFiles.data;
};
