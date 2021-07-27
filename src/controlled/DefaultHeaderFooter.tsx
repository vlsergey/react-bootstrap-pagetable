/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import DivHideIfEmpty from './DivHideIfEmpty';
import React from 'react';
import {useControlledContext} from './ControlledContext';

interface PropsType {
  elements: ((props: unknown) => JSX.Element)[][][];
}

const DefaultHeaderFooter = ({elements}: PropsType): JSX.Element =>
  <DivHideIfEmpty css={css(`& > div {
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
  & > div:empty {
    display: none;
  }
  & > div > div:empty {
    display: none;
  }
  & > div > div > div:empty {
    display: none;
  }
  & > div > div > div:first-of-type {
    padding-left: 0;
  }
  & > div > div > div:last-of-type {
    padding-right: 0;
  }
  `)}>{ elements.map((line, index1) => <DivHideIfEmpty key={index1}>
      { line.map((column, columnIndex) => <DivHideIfEmpty key={columnIndex}>
        { column.map((child, index) =>
          <DivHideIfEmpty key={index}>{React.createElement(child)}</DivHideIfEmpty>)
        }
      </DivHideIfEmpty>) }
    </DivHideIfEmpty>) }
  </DivHideIfEmpty>;

export const DefaultHeader = (): JSX.Element => {
  const {headerElements} = useControlledContext();
  return <DefaultHeaderFooter elements={headerElements} />;
};

export const DefaultFooter = (): JSX.Element => {
  const {footerElements} = useControlledContext();
  return <DefaultHeaderFooter elements={footerElements} />;
};
