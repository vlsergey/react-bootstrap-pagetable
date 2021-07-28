import React from 'react';
import Alert from 'react-bootstrap/Alert';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';

import ControlledContext, {ControlledContextType, useControlledContext}
  from './ControlledContext';
import ControlledPropsType from './ControlledPropsType';
import DefaultColumnHeaderCell from './DefaultColumnHeaderCell';
import DefaultColumnHeaderRow from './DefaultColumnHeaderRow';
import {DefaultFooter, DefaultHeader} from './DefaultHeaderFooter';
import defaultItemFieldCellHyperlink from './defaultItemFieldCellHyperlink';
import DefaultItemFieldCellRenderer from './DefaultItemFieldCellRenderer';
import DefaultNoContentRow from './DefaultNoContentRow';
import DefaultRowsRenderer from './DefaultRowsRenderer';
import PageIndexSelector from './PageIndexSelector';
import PageSizeSelector from './PageSizeSelector';
import useStateOfVisibleFields from './visibleFields/useStateOfVisibleFields';
import useVisibleFields from './visibleFields/useVisibleFields';
import VisibleFieldsButton from './visibleFields/VisibleFieldsButton';

export default function ControlledBase<T> ({
  columnHeaderCell = DefaultColumnHeaderCell,
  columnHeaderRow = DefaultColumnHeaderRow,
  disableVisibleFieldsChange = false,
  footerElements,
  footerRenderer = DefaultFooter,
  hasError = false,
  headerElements,
  headerRenderer = DefaultHeader,
  idPrefix,
  itemFieldCellHyperlink = defaultItemFieldCellHyperlink,
  itemFieldCellRenderer = DefaultItemFieldCellRenderer,
  itemModel,
  loading = false,
  noContentRow = DefaultNoContentRow,
  page,
  rowsRenderer = DefaultRowsRenderer,
  size,
  tableProps = {
    bordered: true,
    hover: true,
    striped: true,
    style: {
      width: 'auto !important'
    }
  },
  ...etcProps
}: ControlledPropsType<T>): JSX.Element {

  const [visibleFields, onVisibleFieldsChange] =
    useStateOfVisibleFields(disableVisibleFieldsChange, idPrefix, itemModel);

  // memoize?
  const actualTableProps: Record<string, unknown> = {
    size,
    ...tableProps
  };

  const contextValue: ControlledContextType<T> = {

    // used here props
    columnHeaderCell,
    columnHeaderRow,
    disableVisibleFieldsChange,
    footerElements,
    footerRenderer,
    hasError,
    headerElements,
    headerRenderer,
    idPrefix,
    itemFieldCellHyperlink,
    itemFieldCellRenderer,
    itemModel,
    loading,
    noContentRow,
    page,
    rowsRenderer,
    size,

    // additional context fields
    visibleFields,
    onVisibleFieldsChange,

    ...etcProps
  };

  return <ControlledContext.Provider value={contextValue}>
    {React.createElement(headerRenderer)}
    <Table {...actualTableProps}>
      <TableHead />
      <tbody>
        { !loading && !hasError && page.content.length == 0 && React.createElement(noContentRow) }
        {React.createElement(rowsRenderer)}
      </tbody>
    </Table>
    {React.createElement(footerRenderer)}
  </ControlledContext.Provider>;
}

const TableHead = () => {
  const {columnHeaderRow, error, hasError, loading} = useControlledContext();
  const visibleFields = useVisibleFields();

  return <thead>
    { React.createElement(columnHeaderRow) }
    { loading && <tr>
      <td colSpan={visibleFields.length}>
        <ProgressBar animated max={100} min={0} now={100} />
      </td>
    </tr> }
    { hasError && <tr>
      <td colSpan={visibleFields.length}>
        <Alert style={{margin: 0}} variant="danger">
          {'Error occured while loading'}
          { !!error && `: ${error.message || JSON.stringify(error)}`}
        </Alert>
      </td>
    </tr> }
  </thead>;
};

ControlledBase.defaultProps = {
  footerElements: [[[VisibleFieldsButton, PageIndexSelector], [PageSizeSelector]]],
  headerElements: [[[VisibleFieldsButton, PageIndexSelector], [PageSizeSelector]]],
};
