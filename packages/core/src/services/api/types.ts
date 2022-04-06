export type TAuthProject = {
  apiKey: string;
};

export type TCreateCoverageMetric = {
  projectId: number;
  totalCoverage: number;
  ref: string;
  sha: string;
};

export type TGetMetrics = {
  projectId: number;
  ref?: string;
  dateTo?: string;
  take?: number;
};

export type TCreateClonesMetric = {
  projectId: number;
  totalLinesPercentage: number;
  totalBranchesPercentage: number;
  ref: string;
  sha: string;
};

export type TCreateGithubAccessToken = {
  appToken: string;
};

export type TRequestVariables =
  | TAuthProject
  | TCreateCoverageMetric
  | TCreateClonesMetric
  | TGetMetrics
  | TCreateGithubAccessToken;

export type TClonesMetric = {
  id: number;
  totalLinesPercentage: number;
  totalBranchesPercentage: number;
  ref: string;
  sha: string;
  createdAt: string;
  updatedAt: string;
};

export type TCoverageMetric = {
  id: number;
  totalCoverage: number;
  ref: string;
  sha: string;
  createdAt: string;
  updatedAt: string;
};
