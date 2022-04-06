import * as fs from 'fs';

import { parseLcovFileData, calculatePercentage, groupLcovData } from './lcov';
import {
  authProject,
  createCoverageMetric,
  coverageMetrics
} from '../api/endpoints';

export const parseLcovFile = async (coverageFilePath: string) => {
  const fileRaw = fs.readFileSync(coverageFilePath, 'utf8');

  if (!fileRaw) {
    throw new Error(
      `No coverage report found at '${coverageFilePath}', exiting...`
    );
  }
  const lcovData = await parseLcovFileData(fileRaw);

  const data = groupLcovData(lcovData)

  const percentage = calculatePercentage(lcovData);

  return { lcovData, data, percentage };
};

export const fetchCoverage = async (
  apiKey: string,
  ref: string
): Promise<number> => {
  const { accessToken, project } = await authProject({ apiKey });

  const [latestCoverage] = await coverageMetrics(accessToken, {
    projectId: project.id,
    ref,
    take: 1
  });

  return latestCoverage ? latestCoverage.totalCoverage : 0;
};

export const sendCoverage = async (
  apiKey: string,
  totalCoverage: number,
  ref: string,
  sha: string
): Promise<number> => {
  const { accessToken, project } = await authProject({ apiKey });

  const createdCoverage = await createCoverageMetric(accessToken, {
    projectId: project.id,
    ref,
    sha,
    totalCoverage
  });

  return createdCoverage.totalCoverage
};
