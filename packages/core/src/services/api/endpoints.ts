import axios from 'axios';

import { barecheckApiUrl } from '../../config';

type TAuthProject = {
  apiKey: string;
};

type TCreateCoverageMetric = {
  projectId: number;
  totalCoverage: number;
  ref: string;
  sha: string;
};

type TCoverageMetrics = {
  projectId: number;
  ref?: string;
  dateTo?: string;
  take?: number;
};

type TCreateGithubAccessToken = {
  appToken: string;
};

type TRequestVariables =
  | TAuthProject
  | TCreateCoverageMetric
  | TCoverageMetrics
  | TCreateGithubAccessToken;

// TODO: define api request response interfaces
const makeRequest = async (
  accessToken: string,
  query: string,
  variables: TRequestVariables
) => {
  const { data } = await axios.post(
    barecheckApiUrl,
    {
      query,
      variables
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              'auth-provider': 'custom',
              authorization: `Bearer ${accessToken}`
            }
          : {})
      }
    }
  );

  return data;
};

export const createGithubAccessToken = async (
  variables: TCreateGithubAccessToken
) => {
  const query = `mutation createGithubAccessToken($appToken: String!) {
    createGithubAccessToken(appToken:$appToken) {
      accessToken
    }
  }`;

  const response = await makeRequest('', query, variables);

  if (!response.data) {
    throw new Error(
      "Couldn't fetch accessToken token by using appToken. Check if you use the correct `BARECHECK_APP_KEY`"
    );
  }

  return response.data.createGithubAccessToken;
};

export const authProject = async (variables: TAuthProject) => {
  const query = `mutation authProject($apiKey: String!) {
    authProject(apiKey:$apiKey) {
      project {
        id
      }
      accessToken
    }
  }`;

  const response = await makeRequest('', query, variables);

  if (!response.data) {
    throw new Error(
      "Couldn't fetch accessToken token by using apiKey. Check if you use the correct `API_KEY`"
    );
  }

  return response.data.authProject;
};

export const createCoverageMetric = async (
  accessToken: string,
  variables: TCreateCoverageMetric
) => {
  const query = `mutation createCoverageMetric($projectId: Int!, $totalCoverage: Float! $ref: String!, $sha: String!) {
    createCoverageMetric(input: {projectId: $projectId, totalCoverage: $totalCoverage, ref: $ref, sha: $sha }) {
      id
      totalCoverage
      ref
      sha
      createdAt
      updatedAt
    }
  }
  `;

  const response = await makeRequest(accessToken, query, variables);

  if (!response.data) {
    throw new Error(
      "Couldn't send your project coverage metric. Check if `accessToken` is valid or receive new one by using `authProject` mutation"
    );
  }

  return response.data.createCoverageMetric;
};

export const coverageMetrics = async (
  accessToken: string,
  variables: TCoverageMetrics
) => {
  const query = `query coverageMetrics($projectId: Int!, $ref: String, $dateTo: DateTime, $take: Int ) {
    coverageMetrics(projectId: $projectId, ref:$ref, dateTo: $dateTo, take: $take){
      id
      ref
      sha
      totalCoverage
      createdAt
    }
  }
  `;

  const response = await makeRequest(accessToken, query, variables);

  if (!response.data) {
    return null;
  }

  return response.data.coverageMetrics;
};
