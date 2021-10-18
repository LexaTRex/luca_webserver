const { expect } = require('chai');

const normalizePath = require('./normalizePath');

describe('normalizePath function', () => {
  it('should replace variable in path with parameter pattern', () => {
    const normalizedPath = normalizePath(
      '/foo/c1917841-8015-44ec-85f8-f5b6ccac04c9',
      '/:bar'
    );

    expect(normalizedPath).equal('/foo/:bar');
  });

  it('should handle trailing slashes', () => {
    const normalizedPath = normalizePath(
      '/foo/c1917841-8015-44ec-85f8-f5b6ccac04c9/',
      '/:bar'
    );

    expect(normalizedPath).equal('/foo/:bar');
  });

  it('should replace multiple variables in path with parameter patterns', () => {
    const normalizedPath = normalizePath(
      '/foo/df4787a0-f9a4-4663-a9df-3682fa28ec68/morefoo/c1917841-8015-44ec-85f8-f5b6ccac04c9',
      '/:bar/morefoo/:morebar'
    );

    expect(normalizedPath).equal('/foo/:bar/morefoo/:morebar');
  });

  it('should return combined path if url contains no values', () => {
    const normalizedPath = normalizePath('/foo/morefoo/', '/:bar');

    expect(normalizedPath).equal('/foo/morefoo/:bar');
  });

  it('should return path if routePath contains no patterns', () => {
    const normalizedPath = normalizePath('/foo/morefoo/', '/bar');

    expect(normalizedPath).equal('/foo/morefoo/');
  });
});
