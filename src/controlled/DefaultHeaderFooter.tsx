/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React from 'react';
import {useControlledContext} from './ControlledContext';

interface PropsType {
  elements: ((props: unknown) => JSX.Element)[][];
}

const DefaultHeaderFooter = ({elements} : PropsType): JSX.Element => {
  return <div css={css(`& {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1em;
  margin-top: 1em;
}
& > div {
  align-items: center;
  display: flex;
}
& > div > div:empty {
  display: none;
}
`)}>
    <div>
      { elements[0].map( (child, index) =>
        <div css={css(`padding-right: 1em;`)} key={index}>{React.createElement(child)}</div> )
      }
    </div>
    <div>
      { elements[1].map( (child, index) =>
        <div css={css(`padding-left: 1em; padding-right: 1em;`)} key={index}>{React.createElement(child)}</div> )
      }
    </div>
    <div>
      { elements[2].map( (child, index) =>
        <div css={css(`padding-left: 1em;`)} key={index}>{React.createElement(child)}</div> )
      }
    </div>
  </div>;
};

export const DefaultHeader = (): JSX.Element => {
  const {headerElements} = useControlledContext();
  return <DefaultHeaderFooter elements={headerElements} />;
}

export const DefaultFooter = (): JSX.Element => {
  const {footerElements} = useControlledContext();
  return <DefaultHeaderFooter elements={footerElements} />;
}
