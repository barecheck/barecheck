import { TClonesStatistic } from './types';

export const getClonesReportBody = (
  title: string,
  statistic: TClonesStatistic
): string => {
  const totalLines = `Total Lines: <b>${statistic.total.lines}</b>`;
  const duplicatedLines = `Duplicated Lines: <b>${statistic.total.duplicatedLines}</b>`;

  const description = `${totalLines}\n\n${duplicatedLines}`;

  const body = `<h3>${title}</h3>${description}`;

  return body;
};

export default getClonesReportBody;
