import fs from 'fs';
import genDiff from '../src';

const diffAtoB = fs.readFileSync(`${__dirname}/__fixtures__/result.txt`, 'utf-8');
const diffForYml = fs.readFileSync(`${__dirname}/__fixtures__/resultForYml.txt`, 'utf-8');

test('compare two JSON files', () => {
  expect(genDiff(`${__dirname}/__fixtures__/before.json`, `${__dirname}/__fixtures__/after.json`)).toEqual(diffAtoB);
});

test('compare two YML files', () => {
  expect(genDiff(`${__dirname}/__fixtures__/before.yml`, `${__dirname}/__fixtures__/after.yml`)).toEqual(diffForYml);
});
