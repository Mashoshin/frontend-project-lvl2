import parse from './parser';
import buildAst from './builder';
import render from './formatters/index';

const genDiff = (path1, path2, format = 'nested') => {
  const obj1 = parse(path1);
  const obj2 = parse(path2);
  const diffAst = buildAst(obj1, obj2);
  const result = render(format, diffAst);
  return result;
};

export default genDiff;
