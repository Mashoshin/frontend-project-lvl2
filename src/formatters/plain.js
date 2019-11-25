import _ from 'lodash';

const stringify = (parameter) => {
  if (!_.isObject(parameter)) {
    return `'${parameter}'`;
  }
  return '[complex value]';
};

const nodeTypes = [
  {
    check: (node) => node.type === 'unchanged',
    process: () => '',
  },
  {
    check: (node) => node.type === 'changed',
    process: (node, currentPath) => `Property '${currentPath}' was updated. From ${stringify(node.beforeValue)} to ${stringify(node.afterValue)}`,
  },
  {
    check: (node) => node.type === 'added',
    process: (node, currentPath) => `Property '${currentPath}' was added with value: ${stringify(node.afterValue)}`,
  },
  {
    check: (node) => node.type === 'deleted',
    process: (node, currentPath) => `Property '${currentPath}' was removed`,
  },
  {
    check: (node) => node.type === 'nested',
    process: (node, currentPath, fn) => fn(node.children, `${currentPath}`),
  },
];

const getPropertyAction = (property) => nodeTypes.find(({ check }) => check(property));

const renderPlain = (ast) => {
  const iter = (astree, path = '') => {
    const result = astree.map((node) => {
      const currentPath = path === '' ? `${node.name}` : `${path}.${node.name}`;
      const { process } = getPropertyAction(node);
      return process(node, currentPath, iter);
    });
    return `${result.filter((str) => str !== '').join('\n')}`;
  };
  const res = iter(ast);
  return res;
};

export default renderPlain;
