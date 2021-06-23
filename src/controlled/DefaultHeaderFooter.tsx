/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React from 'react';
import {useControlledContext} from './ControlledContext';

interface PropsType {
  elements: ((props: unknown) => JSX.Element)[][][];
}

const DefaultHeaderFooter = ({elements}: PropsType): JSX.Element =>
  <div css={css(`& > div {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 1em;
    margin-top: 1em;
  }
  & > div > div {
    align-items: center;
    display: flex;
  }
  & > div > div > div {
    padding-left: .5em;
    padding-right: .5em;
  }
  & > div > div > div:empty {
    display: none;
  }
  & > div > div > div:first-child {
    padding-left: 0;
  }
  & > div > div > div:last-child {
    padding-right: 0;
  }
  `)}>{ elements.map((line, index1) => <div key={index1}>
      { line.map((column, columnIndex) => <div key={columnIndex}>
        { column.map((child, index) =>
          <div key={index}>{React.createElement(child)}</div>)
        }
      </div>) }
    </div>) }
  </div>;

export const DefaultHeader = (): JSX.Element => {
  const {headerElements} = useControlledContext();
  return <DefaultHeaderFooter elements={headerElements} />;
};

export const DefaultFooter = (): JSX.Element => {
  const {footerElements} = useControlledContext();
  return <DefaultHeaderFooter elements={footerElements} />;
};
