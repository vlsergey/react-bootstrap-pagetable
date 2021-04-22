import Application from './Application';
import React from 'react';
import ReactDom from 'react-dom';

require( 'bootstrap/dist/css/bootstrap.min.css' );

const appElement : ( Element | null | undefined ) = document.getElementById( 'app' );
if ( !appElement ) throw new Error( 'Element with ID "app" not found in document DOM' );

ReactDom.render( <Application />, appElement );
