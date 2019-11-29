import _ from 'lodash';

const stringify = (parameter) => {
  if (!_.isObject(parameter)) {
    return `'${parameter}'`;
  }
  return '[complex value]';
};

const nodeTypes = {
  unchanged: () => '',
  changed: (node, currentPath) => `Property '${currentPath}' was updated. From ${stringify(node.beforeValue)} to ${stringify(node.afterValue)}`,
  added: (node, currentPath) => `Property '${currentPath}' was added with value: ${stringify(node.afterValue)}`,
  deleted: (node, currentPath) => `Property '${currentPath}' was removed`,
  nested: (node, currentPath, fn) => fn(node.children, `${currentPath}`),
};

const renderPlain = (ast) => {
  const iter = (astree, path = '') => {
    const result = astree.map((node) => {
      const currentPath = path === '' ? `${node.name}` : `${path}.${node.name}`;
      return nodeTypes[node.type](node, currentPath, iter);
    });
    return `${result.filter((str) => str !== '').join('\n')}`;
  };
  const res = iter(ast);
  return res;
};

export default renderPlain;
