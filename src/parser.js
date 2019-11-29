import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const getParser = (pathToFile) => {
  const currentFormat = path.extname(pathToFile);
  return parsers[currentFormat];
};

export default getParser;
