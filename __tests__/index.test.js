import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const commonPath = `${__dirname}/__fixtures__/`;

const data = [
  ['before.json', 'after.json', 'resultForJson.txt'],
  ['before.yml', 'after.yml', 'resultForJson.txt'],
  ['before.ini', 'after.ini', 'resultForJson.txt'],
];

test.each(data)('compare two files(%s, %s)', (path1, path2, expected) => {
  const pathToFirst = path.join(commonPath, path1);
  const pathToSecond = path.join(commonPath, path2);
  const correctAnswer = fs.readFileSync(path.join(commonPath, expected), 'utf-8');
  expect(genDiff(pathToFirst, pathToSecond)).toEqual(correctAnswer);
});
