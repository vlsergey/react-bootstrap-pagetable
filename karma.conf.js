/* eslint-disable */
const path = require( 'path' );

const ESLintPlugin = require('eslint-webpack-plugin');

const imported = require( '@vlsergey/js-config' ).karma;
module.exports = function( config ) {
  imported(config);
  config.set( {
    files: [
      'test/**/*Test.ts*',
    ],
    webpack: {
      output: {
          path: path.resolve(__dirname, '../lib/'),
      },
      plugins: [
        new ESLintPlugin( {
          fix: true,
        } ),
      ],
    }
  } );
};
