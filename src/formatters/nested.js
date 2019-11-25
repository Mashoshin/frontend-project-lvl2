import _ from 'lodash';

const space = '    ';

const stringify = (parameter, deepLevel = 0) => {
  if (!_.isObject(parameter)) {
    return `${parameter}`;
  }
  const nextDeepLevel = deepLevel + 1;
  const result = _.toPairs(parameter).map((el) => `${space.repeat(nextDeepLevel)}${el[0]}: ${stringify(el[1], nextDeepLevel)}`);
  return `{\n${result.join('\n')}\n${space.repeat(deepLevel)}}`;
};

const nodeTypes = [
  {
    check: (node) => node.type === 'unchanged',
    process: (node, deep) => `${space.repeat(deep)}${node.name}: ${stringify(node.beforeValue, deep)}`,
  },
  {
    check: (node) => node.type === 'changed',
    process: (node, deep) => `${space.repeat(deep).slice(2)}- ${node.name}: ${stringify(node.beforeValue, deep)}\n${space.repeat(deep).slice(2)}+ ${node.name}: ${stringify(node.afterValue, deep)}`,
  },
  {
    check: (node) => node.type === 'added',
    process: (node, deep) => `${space.repeat(deep).slice(2)}+ ${node.name}: ${stringify(node.afterValue, deep)}`,
  },
  {
    check: (node) => node.type === 'deleted',
    process: (node, deep) => `${space.repeat(deep).slice(2)}- ${node.name}: ${stringify(node.beforeValue, deep)}`,
  },
  {
    check: (node) => node.type === 'nested',
    process: (node, deep, fn) => `${space.repeat(deep)}${node.name}: ${fn(node.children, deep)}`,
  },
];

const getPropertyAction = (property) => nodeTypes.find(({ check }) => check(property));

const renderNested = (ast) => {
  const iter = (tree, deepLevel = 0) => {
    const nextDeepLevel = deepLevel + 1;
    const result = tree.map((node) => {
      const { process } = getPropertyAction(node);
      return process(node, nextDeepLevel, iter);
    });
    return `{\n${result.join('\n')}\n${space.repeat(deepLevel)}}`;
  };
  const result = iter(ast);
  return result;
};

export default renderNested;
