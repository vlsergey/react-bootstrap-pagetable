/* eslint-disable */
const path = require( 'path' );

const imported = require( '@vlsergey/js-config' ).karma;
module.exports = function( config ) {
  imported(config);
  config.set( {
    files: [
      'test/**/*Test.tsx',
    ],
    webpack: {
      output: {
          path: path.resolve(__dirname, '../lib/'),
      },
    }
  } );
};
