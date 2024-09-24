import boolFromString from './boolFromString';
import safeJSONParse from '../../scripts/utils/safeJsonParse';

const buildConfig = (dataset) => {
  const tempConf = { config: {} };
  const keys = Object.keys(dataset).filter((key) =>
    key.includes('appLayerConfig'),
  );
  keys.map((k) => {
    switch (k) {
      case 'appLayerConfigSearch':
        if (boolFromString(dataset[k])) {
          return (tempConf['config'][k] = safeJSONParse(dataset[k]));
        } else {
          return (tempConf['config'][k] = false);
        }
      default:
        return (tempConf['config'][k] = boolFromString(dataset[k]));
    }
  });
  return tempConf;
};

export default buildConfig;
