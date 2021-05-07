/* eslint-disable */
const imported = require( '@vlsergey/js-config' ).eslint;
module.exports = {
  ...imported,
  parserOptions: {
    ...imported,
    project: [
      './tsconfig.json',
      './src/tsconfig.json',
      './test/tsconfig.json',
      './demo/tsconfig.json',
      './demo/src/tsconfig.json',
    ],
  },
  rules: {
    ...imported.rules,
    'no-duplicate-imports': 0,
  },
};
