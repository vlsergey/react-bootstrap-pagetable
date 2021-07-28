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
  rules: {
    "react/jsx-no-bind": 0,
    "@typescript-eslint/no-confusing-void-expression": 0,
  },
  plugins: [ 'promise' ],
};
