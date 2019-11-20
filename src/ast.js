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

const propertyActions = [
  {
    type: 'nested',
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (obj1, obj2, key, fn) => makeNode(key, {}, {}, fn(obj1[key], obj2[key]), 'nested'),
  },
  {
    type: 'unchanged',
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && (obj1[key] === obj2[key]),
    process: (obj1, obj2, key) => makeNode(key, obj1[key], obj2[key], [], 'unchanged'),
  },
  {
    name: 'changed',
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && (obj1[key] !== obj2[key]),
    process: (obj1, obj2, key) => makeNode(key, obj1[key], obj2[key], [], 'changed'),
  },
  {
    name: 'added',
    check: (obj1, obj2, key) => !_.has(obj1, key) && _.has(obj2, key),
    process: (obj1, obj2, key) => makeNode(key, {}, obj2[key], [], 'added'),
  },
  {
    name: 'deleted',
    check: (obj1, obj2, key) => _.has(obj1, key) && !_.has(obj2, key),
    process: (obj1, obj2, key) => makeNode(key, obj1[key], {}, [], 'deleted'),
  },
];

const getPropertyAction = (obj1, obj2, key) => propertyActions.find(({ check }) => {
  const result = check(obj1, obj2, key);
  return result;
});

const ast = (obj1, obj2) => {
  const allUniqKeyses = _.union(Object.keys(obj1), Object.keys(obj2));
  const res = allUniqKeyses.reduce((acc, key) => {
    const { process } = getPropertyAction(obj1, obj2, key);
    return [...acc, process(obj1, obj2, key, ast)];
  }, []);
  return res;
};

export default ast;
