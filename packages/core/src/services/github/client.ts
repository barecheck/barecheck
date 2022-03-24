import { Octokit } from '@octokit/core';

import { createGithubAccessToken } from '../api/endpoints';

const createNewAccessToken = async (appToken: string) => {
  const { accessToken } = await createGithubAccessToken({ appToken });

  return accessToken;
};

export const createOctokitClient = async (
  appToken: string,
  githubToken?: string
) => {
  let githubAccessToken = null;

  if (appToken) {
    githubAccessToken = await createNewAccessToken(appToken);
  } else {
    if (!githubToken) {
      throw new Error(
        'Either Application or Github token is required to create Octokit client'
      );
    }

    githubAccessToken = githubToken;
  }

  const octokit = new Octokit({ auth: githubAccessToken });

  return octokit;
};
