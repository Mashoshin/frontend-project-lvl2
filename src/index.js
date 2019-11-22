import parse from './parser';
import ast from './ast';
import render from './formatters/index';

const genDiff = (path1, path2, format) => {
  const obj1 = parse(path1);
  const obj2 = parse(path2);
  const diffAst = ast(obj1, obj2);
  const result = render(format, diffAst);
  return result;
};

export default genDiff;
