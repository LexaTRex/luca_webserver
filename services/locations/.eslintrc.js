const path = require('path');

module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['jsx-a11y', 'sonarjs'],
  extends: [
    'react-app',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [path.join(__dirname, './src')],
      },
    },
  },
  rules: {
    'jsx-a11y/autocomplete-valid': 'off', // craco seams to not understand this...
    'no-unused-vars': 2,
    'no-console': 1,
    'max-lines': [1, 400],
    complexity: 2,
    'new-cap': 0,
    'require-await': 2,
    'prefer-promise-reject-errors': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': 0,
    'react-hooks/exhaustive-deps': 2,
    'import/prefer-default-export': 0,
    'import/no-default-export': 2,
    'import/no-namespace': 0,
    'unicorn/better-regex': 1,
    'unicorn/consistent-destructuring': 0,
    'unicorn/explicit-length-check': 0,
    'unicorn/filename-case': 0,
    'unicorn/no-array-for-each': 0,
    'unicorn/no-array-reduce': 0,
    'unicorn/no-new-array': 0,
    'unicorn/no-null': 0,
    'unicorn/prefer-number-properties': 0,
    'unicorn/prefer-regexp-test': 0,
    'unicorn/prevent-abbreviations': 2,
    'unicorn/consistent-function-scoping': 0, // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/374#issuecomment-532348080,
    'promise/always-return': 0,
    'promise/no-return-wrap': 1,
    'sonarjs/no-small-switch': 0,
    'sonarjs/cognitive-complexity': 1,
    'react/no-array-index-key': 1,
    'unicorn/number-literal-case': 0,
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.js', 'src/testHelper/*'],
      },
    ],
  },
  overrides: [
    {
      files: ['src/graphql/**', '*.query.js'],
      rules: {
        camelcase: 'off',
      },
    },
  ],
};
