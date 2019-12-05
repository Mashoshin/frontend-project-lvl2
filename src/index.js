import fs from 'fs';
import path from 'path';
import getParser from './parser';
import buildAst from './builder';
import render from './formatters/index';


const genDiff = (path1, path2, outputFormat = 'nested') => {
  const data1 = fs.readFileSync(path1, 'utf8');
  const data2 = fs.readFileSync(path2, 'utf8');
  const dataType1 = path.extname(path1);
  const dataType2 = path.extname(path2);
  const obj1 = getParser(dataType1)(data1);
  const obj2 = getParser(dataType2)(data2);
  const diffAst = buildAst(obj1, obj2);
  const result = render(outputFormat, diffAst);
  return result;
};

export default genDiff;
