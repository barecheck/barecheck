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
