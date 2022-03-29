import {
  getDefaultOptions,
  IMapFrame,
  IOptions,
  MemoryStore,
  Statistic
} from '@jscpd/core';
import { getFilesToDetect, InFilesDetector } from '@jscpd/finder';
import { getSupportedFormats, Tokenizer } from '@jscpd/tokenizer';

export const detectClones = async (path: string[], options: IOptions = {}) => {
  const defaultOptions = {
    ...getDefaultOptions(),
    ...{
      format: getSupportedFormats()
    }
  };

  const jscpdOptions = {
    ...defaultOptions,
    ...options,
    ...{ path }
  };

  const tokenizer = new Tokenizer();
  // here you can use any store what implement IStore interface
  const store = new MemoryStore<IMapFrame>();
  const statistic = new Statistic(jscpdOptions);

  const files = getFilesToDetect(jscpdOptions);

  const detector = new InFilesDetector(
    tokenizer,
    store,
    statistic,
    jscpdOptions
  );

  const clones = await detector.detect(files);

  return { statistic: statistic.getStatistic(), clones };
};

export default detectClones;
