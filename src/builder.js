import _ from 'lodash';

const makeNode = (name, beforeValue, afterValue, children, type) => {
  const node = {
    name,
    beforeValue,
    afterValue,
    children,
    type,
  };
  return node;
};

const nodeTypes = [
  {
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (obj1, obj2, key, fn) => makeNode(key, null, null, fn(obj1[key], obj2[key]), 'nested'),
  },
  {
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && (obj1[key] === obj2[key]),
    process: (obj1, obj2, key) => makeNode(key, obj1[key], obj2[key], null, 'unchanged'),
  },
  {
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && (obj1[key] !== obj2[key]),
    process: (obj1, obj2, key) => makeNode(key, obj1[key], obj2[key], null, 'changed'),
  },
  {
    check: (obj1, obj2, key) => !_.has(obj1, key) && _.has(obj2, key),
    process: (obj1, obj2, key) => makeNode(key, null, obj2[key], null, 'added'),
  },
  {
    check: (obj1, obj2, key) => _.has(obj1, key) && !_.has(obj2, key),
    process: (obj1, obj2, key) => makeNode(key, obj1[key], null, null, 'deleted'),
  },
];

const buildAst = (obj1, obj2) => {
  const allUniqKeyses = _.union(Object.keys(obj1), Object.keys(obj2));
  const result = allUniqKeyses.map((key) => {
    const { process } = nodeTypes.find(({ check }) => check(obj1, obj2, key));
    return process(obj1, obj2, key, buildAst);
  });
  return result;
};

export default buildAst;
