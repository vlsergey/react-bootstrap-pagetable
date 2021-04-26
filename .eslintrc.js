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
    'import/named': 0,
    'import/no-unused-modules': 0,
    'no-duplicate-imports': 0,
  },
};
