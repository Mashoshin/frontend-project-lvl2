import _ from 'lodash';

const space = '    ';

const stringify = (parameter, deep = 0) => {
  if (!_.isObject(parameter)) {
    return `${parameter}`;
  }
  const deeper = deep + 1;
  const result = _.toPairs(parameter).map((el) => `${space.repeat(deeper)}${el[0]}: ${stringify(el[1], deeper)}`);
  return `{\n${result.join('\n')}\n${space.repeat(deep)}}`;
};

const propertyActions = [
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

const getPropertyAction = (property) => propertyActions.find(({ check }) => check(property));

const renderJson = (ast) => {
  const iter = (astree, deep = 0) => {
    const deeper = deep + 1;
    const result = astree.map((node) => {
      const { process } = getPropertyAction(node);
      return process(node, deeper, iter);
    });
    return `{\n${result.join('\n')}\n${space.repeat(deep)}}`;
  };
  const res = iter(ast);
  return res;
};

export default renderJson;
