import lcov from 'lcov-parse';
import {
  TLcovData,
  TGroupedFilesLcovData,
  TGroupedLinesLcovData
} from './types';

const groupByFile = (lcovData: TLcovData[]): TGroupedFilesLcovData[] => {
  const response = [];

  lcovData.forEach((fileData) => {
    const lines = fileData.lines.details
      .filter(({ hit }) => hit === 0)
      .map(({ line }) => line);

    if (lines.length > 0) {
      response.push({
        file: fileData.file,
        lines
      });
    }
  });

  return response;
};

// TODO: this function is interapted by empty lines
// Need to find a way how we can avoid this in order to keep the whole interval
const groupByFileLines = (
  filesLines: TGroupedFilesLcovData[]
): TGroupedLinesLcovData[] =>
  // eslint-disable-next-line max-statements
  filesLines.map(({ file, lines }) => {
    const groupedLines = [];
    let previousLine = null;
    let startLine = null;

    const pushCurrentStateToArray = () =>
      groupedLines.push(
        startLine !== previousLine ? [startLine, previousLine] : previousLine
      );

    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      // initialize first element
      if (startLine === null) {
        startLine = line;
        previousLine = line;
        // eslint-disable-next-line no-continue
        continue;
      }

      /// group elements to range
      if (previousLine !== line - 1) {
        pushCurrentStateToArray();
        startLine = line;
      }

      previousLine = line;
    }

    // Push last element
    pushCurrentStateToArray();

    return { file, lines: groupedLines };
  });

export const groupLcovData = (lcovData: TLcovData[]): TGroupedLinesLcovData[] => {
  const groupedFiles = groupByFile(lcovData);

  const groupedFileLines = groupByFileLines(groupedFiles);

  return groupedFileLines;
};

// TODO: add types for data and lcovData
export const parseLcovFileData = (data: string): Promise<TLcovData[]> =>
  new Promise((resolve, reject) =>
    lcov(data, (err: Error, res: TLcovData[]) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    })
  );

export const calculatePercentage = (lcovData: TLcovData[]): number => {
  let hit = 0;
  let found = 0;

  lcovData.forEach((entry) => {
    hit += entry.lines.hit;
    found += entry.lines.found;
  });

  return parseFloat(((hit / found) * 100).toFixed(2));
};
