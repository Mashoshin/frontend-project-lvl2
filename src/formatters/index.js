import plain from './plain';
import nested from './nested';
import json from './json';

const formats = {
  plain,
  nested,
  json,
};

const render = (format, ast) => {
  const selectRender = formats[format];
  return selectRender(ast);
};
export default render;
