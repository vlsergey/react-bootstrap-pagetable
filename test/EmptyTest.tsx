import { assert } from 'chai';

describe( 'karma', () => {
  it( 'works', () => {
    const name = 'World';
    assert.equal( 'Hello, World!', `Hello, ${name}!` );
  } );
} );
