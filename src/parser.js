import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parse = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf8');
  const currentFormat = path.extname(pathToFile);
  return parsers[currentFormat](data);
};

export default parse;
