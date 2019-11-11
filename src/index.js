import _ from 'lodash';
import parse from './parser';

const genDiff = (path1, path2) => {
  const obj1 = parse(path1);
  const obj2 = parse(path2);
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
