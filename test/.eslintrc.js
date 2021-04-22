/* eslint-disable */
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    // for test:
    describe: true,
    it: true,
  },
  plugins: [ 'promise' ],

  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [ 'node_modules', 'src', 'test' ],
      },
    },
  },
};
