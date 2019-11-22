import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const commonPath = `${__dirname}/__fixtures__/`;

const data = [
  ['nestedBefore.json', 'nestedAfter.json', 'resultForNested.txt', 'nested'],
  ['nestedBefore.yml', 'nestedAfter.yml', 'resultForNested.txt', 'nested'],
  ['nestedBefore.ini', 'nestedAfter.ini', 'resultForNested.txt', 'nested'],
  ['nestedBefore.json', 'nestedAfter.json', 'resultForPlain.txt', 'plain'],
  ['nestedBefore.yml', 'nestedAfter.yml', 'resultForPlain.txt', 'plain'],
  ['nestedBefore.ini', 'nestedAfter.ini', 'resultForPlain.txt', 'plain'],
  ['nestedBefore.json', 'nestedAfter.json', 'resultForJson.txt', 'json'],
  ['nestedBefore.yml', 'nestedAfter.yml', 'resultForJson.txt', 'json'],
  ['nestedBefore.ini', 'nestedAfter.ini', 'resultForJson.txt', 'json'],
];

test.each(data)('compare two files(%s, %s)', (path1, path2, expected, format) => {
  const pathToFirst = path.join(commonPath, path1);
  const pathToSecond = path.join(commonPath, path2);
  const correctAnswer = fs.readFileSync(path.join(commonPath, expected), 'utf-8');
  expect(genDiff(pathToFirst, pathToSecond, format)).toEqual(correctAnswer);
});
