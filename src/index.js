import fs from 'fs';
import _ from 'lodash';

const genDiff = (path1, path2) => {
  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  const obj1 = JSON.parse(data1);
  const obj2 = JSON.parse(data2);
  const allUniqKeyses = _.union(Object.keys(obj1), Object.keys(obj2));
  const resultObj = allUniqKeyses.reduce((acc, key) => {
    if (_.has(obj1, key) && _.has(obj2, key)) {
      if (obj1[key] === obj2[key]) {
        return [...acc, `    ${key}: ${obj1[key]}`];
      }
      return [...acc, `  - ${key}: ${obj1[key]}`, `  + ${key}: ${obj2[key]}`];
    }
    if (_.has(obj1, key) && !_.has(obj2, key)) {
      return [...acc, `  - ${key}: ${obj1[key]}`];
    }
    return [...acc, `  + ${key}: ${obj2[key]}`];
  }, []);
  return `{\n${resultObj.join('\n')}\n}`;
};

export default genDiff;
