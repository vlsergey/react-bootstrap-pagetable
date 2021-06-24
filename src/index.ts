import ControlledContext, {ControlledContextType, useControlledContext}
  from './controlled/ControlledContext';
import {DefaultFooter, DefaultHeader} from './controlled/DefaultHeaderFooter';
import DefaultItemFieldCellRenderer,
{PropsType as DefaultItemFieldCellRendererPropsType}
  from './controlled/DefaultItemFieldCellRenderer';
import FieldModel, {FilterCellRendererProps, FilterValueConverter,
  ValueGetter, ValueRendererProps} from './FieldModel';
import Page, {emptyPage, singlePage} from './Page';
import Action from './actions/Action';
import ActionButtonPropsType from './actions/ActionButtonPropsType';
import ActionsToolbar from './actions/ActionsToolbar';
import ControlledBase from './controlled';
import DefaultRowsRenderer from './controlled/DefaultRowsRenderer';
import FetchArgs from './FetchArgs';
import fetchFromArray from './fetchFromArray';
import fetchFromSpringDataRest from './fetchFromSpringDataRest';
import FieldFilterCell from './filterable/FieldFilterCell';
import ItemFieldCellRendererPropsType
  from './controlled/ItemFieldCellRendererPropsType';
import ItemFieldValue from './ItemFieldValue';
import ItemModel from './ItemModel';
import PageIndexSelector from './controlled/PageIndexSelector';
import PageSizeSelector from './controlled/PageSizeSelector';
import springDataRestResponseToPage from './springDataRestResponseToPage';
import useVisibleFields from './controlled/visibleFields/useVisibleFields';
import VisibleFieldsButton from './controlled/visibleFields/VisibleFieldsButton';
import withActions from './actions/withActions';
import withFetchArgsInState from './withFetchArgsInState';
import withFilterable from './filterable/withFilterable';
import withPageInState from './withPageInState';
import withReactRouter from './reactRouter/withReactRouter';
import withSelectable from './selectable/withSelectable';
import withSortable from './sortable';

export {
  // API interfaces and models
  Action,
  ActionButtonPropsType,
  FetchArgs,
  FilterCellRendererProps,
  FilterValueConverter,
  FieldModel,
  ItemModel,
  Page,
  ValueGetter,
  ValueRendererProps,

  // core implementation components (API hiders and simplifiers)
  FieldFilterCell,
  ItemFieldValue,

  // utils
  emptyPage,
  fetchFromArray,
  fetchFromSpringDataRest,
  singlePage,
  springDataRestResponseToPage,

  // advanced API
  ControlledBase,
  withActions,
  withFetchArgsInState,
  withFilterable,
  withPageInState,
  withReactRouter,
  withSelectable,
  withSortable,

  // customization
  ControlledContext, ControlledContextType, useControlledContext, useVisibleFields,
  ItemFieldCellRendererPropsType, DefaultItemFieldCellRenderer, DefaultItemFieldCellRendererPropsType,
  DefaultRowsRenderer,

  // header-footer customization
  DefaultFooter, DefaultHeader,
  ActionsToolbar, PageIndexSelector, PageSizeSelector, VisibleFieldsButton,
};

// Main mixins (what user is advised to use)
export const ControlledPageTable = withActions(withSortable(withFilterable(withSelectable(ControlledBase))));
export const UncontrolledPageTable = withFetchArgsInState(withPageInState(ControlledPageTable));
export const ControlledWithReactRouter = withReactRouter(ControlledPageTable);
export const UncontrolledWithReactRouter = withReactRouter(withPageInState(ControlledPageTable));

export default UncontrolledPageTable;
