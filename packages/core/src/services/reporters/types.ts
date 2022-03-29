export type TCoverageChangedFileline = number[] | number;

export type TCoverageChangedFile = {
  file: string;
  lines: TCoverageChangedFileline[];
  url: string;
};

export type TCoverageReporterParams = {
  title: string;
  changedFiles: TCoverageChangedFile[];
  coverageDiff: number;
  totalCoverage: number;
};

export type TClonesStatisticRow = {
  lines: number;
  tokens: number;
  sources: number;
  duplicatedLines: number;
  duplicatedTokens: number;
  clones: number;
  percentage: number;
  percentageTokens: number;
  newDuplicatedLines: number;
  newClones: number;
};

export type TClonesStatisticFormat = {
  sources: Record<string, TClonesStatisticRow>;
  total: TClonesStatisticRow;
};

export type TClonesStatistic = {
  total: TClonesStatisticRow;
  detectionDate: string;
  formats: Record<string, TClonesStatisticFormat>;
};
