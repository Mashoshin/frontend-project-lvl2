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
    type: 'nested',
  },
  {
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && (obj1[key] === obj2[key]),
    type: 'unchanged',
  },
  {
    check: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key)
    && (obj1[key] !== obj2[key]),
    type: 'changed',
  },
  {
    check: (obj1, obj2, key) => !_.has(obj1, key) && _.has(obj2, key),
    type: 'added',
  },
  {
    check: (obj1, obj2, key) => _.has(obj1, key) && !_.has(obj2, key),
    type: 'deleted',
  },
];

const getPropertyAction = (obj1, obj2, key) => nodeTypes.find(({ check }) => {
  const result = check(obj1, obj2, key);
  return result;
});

const buildAst = (obj1, obj2) => {
  const allUniqKeyses = _.union(Object.keys(obj1), Object.keys(obj2));
  const result = allUniqKeyses.map((key) => {
    const { type } = getPropertyAction(obj1, obj2, key);
    if (type === 'nested') {
      return makeNode(key, null, null, buildAst(obj1[key], obj2[key]), type);
    }
    if (type === 'unchanged') {
      return makeNode(key, obj1[key], obj2[key], null, type);
    }
    if (type === 'changed') {
      return makeNode(key, obj1[key], obj2[key], null, type);
    }
    if (type === 'added') {
      return makeNode(key, null, obj2[key], null, 'added');
    }
    return makeNode(key, obj1[key], null, null, 'deleted');
    // не знаю на сколько правильно понял на счет задания типа в общей логике
  });
  return result;
};

export default buildAst;
