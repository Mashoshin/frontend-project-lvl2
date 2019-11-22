import plain from './plain';
import nested from './nested';

const formats = {
  plain,
  nested,
};

const render = (format, ast) => {
  const selectRender = formats[format];
  return selectRender(ast);
};
export default render;
