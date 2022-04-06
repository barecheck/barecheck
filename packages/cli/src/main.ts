import { barecheckApi } from '@barecheck/core';

/**
 * Testing script to send metrics and receive them
 * TODO: Should be changed with actual commands to send metrics
 */
export async function cli() {
  const { project, accessToken } = await barecheckApi.authProject({
    apiKey: process.env.BARECHECK_API_KEY
  });

  console.log(project, accessToken);

  const coverageMetrics = await barecheckApi.createCoverageMetric(accessToken, {
    projectId: project.id,
    totalCoverage: 90.4,
    ref: 'main',
    sha: '321'
  });

  const clonesMetric = await barecheckApi.createClonesMetric(accessToken, {
    projectId: project.id,
    totalLinesPercentage: 50.2,
    totalBranchesPercentage: 50,
    ref: 'main',
    sha: '321'
  });

  const clones = await barecheckApi.clonesMetrics(accessToken, {
    projectId: project.id
  });

  const coverage = await barecheckApi.coverageMetrics(accessToken, {
    projectId: project.id
  });

  console.log('coverageMetrics', coverageMetrics);
  console.log('clonesMetric', clonesMetric);

  console.log('clones', clones);
  console.log('coverage', coverage);
}

cli();
