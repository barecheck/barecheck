import {
  TCoverageReporterParams,
  TCoverageChangedFile,
  TCoverageChangedFileline
} from './types';

const buildTableRow = ({ file, lines, url }) => {
  const getChangesLink = (lineLines: string) => `${url}${lineLines}`;
  // TODO: find a way to get diff patch
  // `https://github.com/${owner}/${repo}/pull/${pullRequestNumber}/files#diff-${sha}${lines}`;

  const buildArrayLink = (lineLines: number[]) => {
    const href = getChangesLink(`#L${lineLines[0]}-L${lineLines[1]}`);
    const text = lineLines.join('-');
    return `<a href="${href}">${text}</a>`;
  };
  const buildLink = (line: number) =>
    `<a href="${getChangesLink(`#L${line}`)}">${line}</a>`;

  const buildUncoveredLines = (line: TCoverageChangedFileline) =>
    Array.isArray(line) ? buildArrayLink(line) : buildLink(line);

  const formattedlines = lines.map(buildUncoveredLines).join(', ');
  const formattedFile = `<a href="${getChangesLink('')}">${file}</a>`;

  return `<tr><td>${formattedFile}</td><td>${formattedlines}</td></tr>`;
};

const buildDetailsBlock = (changedFiles: TCoverageChangedFile[]): string => {
  if (changedFiles.length === 0) return '✅ All code changes are covered';

  const summary = '<summary>Uncovered files and lines</summary>';

  const tableHeader = '<tr><th>File</th><th>Lines</th></tr>';
  const tableBody = changedFiles.map(buildTableRow).join('');
  const table = `<table><tbody>${tableHeader}${tableBody}</tbody></table>`;

  return `<details>${summary}${table}</details>`;
};

export const getCoverageReportBody = ({
  changedFiles,
  title,
  coverageDiff,
  totalCoverage
}: TCoverageReporterParams): string => {
  const coverageDiffOutput = coverageDiff < 0 ? '▾' : '▴';
  const trendArrow = coverageDiff === 0 ? '' : coverageDiffOutput;
  const header = `${title}`;
  const detailsWithChangedFiles = buildDetailsBlock(changedFiles);
  const descTotal = `Total: <b>${totalCoverage}%</b>`;
  const descCoverageDiff = `Your code coverage diff: <b>${coverageDiff}% ${trendArrow}</b>`;
  const description = `${descTotal}\n\n${descCoverageDiff}`;

  const body = `<h3>${header}</h3>${description}\n\n${detailsWithChangedFiles}`;

  return body;
};

export default getCoverageReportBody;
