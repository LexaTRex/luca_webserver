const UrlValueParser = require('url-value-parser');

module.exports = (path, routePath) => {
  const parser = new UrlValueParser();
  const masks = routePath.split('/').filter(part => part.startsWith(':'));
  const { chunks, valueIndexes } = parser.parsePathValues(path);

  if (valueIndexes.length === 0 && masks.length > 0) {
    return `${path}${routePath}`.replace('//', '/');
  }

  if (masks.length === 0) {
    return path;
  }

  return [
    '',
    ...chunks.map((chunk, index) =>
      valueIndexes.includes(index) ? masks.shift() : chunk
    ),
  ].join('/');
};
