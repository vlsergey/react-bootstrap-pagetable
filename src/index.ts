import Action from './actions/Action';
import ActionButtonPropsType from './actions/ActionButtonPropsType';
import ActionsToolbar from './actions/ActionsToolbar';
import withActions from './actions/withActions';
import ControlledBase from './controlled';
import ControlledContext, {ControlledContextType, useControlledContext}
  from './controlled/ControlledContext';
import {DefaultFooter, DefaultHeader} from './controlled/DefaultHeaderFooter';
import DefaultItemFieldCellRenderer,
{PropsType as DefaultItemFieldCellRendererPropsType}
  from './controlled/DefaultItemFieldCellRenderer';
import DefaultRowsRenderer from './controlled/DefaultRowsRenderer';
import ItemFieldCellRendererPropsType
  from './controlled/ItemFieldCellRendererPropsType';
import PageIndexSelector from './controlled/PageIndexSelector';
import PageSizeSelector from './controlled/PageSizeSelector';
import useVisibleFields from './controlled/visibleFields/useVisibleFields';
import VisibleFieldsButton from './controlled/visibleFields/VisibleFieldsButton';
import FetchArgs from './FetchArgs';
import fetchFromArray from './fetchFromArray';
import fetchFromSpringDataRest from './fetchFromSpringDataRest';
import FieldModel, {FilterCellRendererProps, FilterValueConverter,
  ValueGetter, ValueRendererProps} from './FieldModel';
import FieldFilterCell from './filterable/FieldFilterCell';
import withFilterable from './filterable/withFilterable';
import ItemFieldValue from './ItemFieldValue';
import ItemModel from './ItemModel';
import Page, {emptyPage, singlePage} from './Page';
import withReactRouter from './reactRouter/withReactRouter';
import withSelectable from './selectable/withSelectable';
import withSortable from './sortable';
import springDataRestResponseToPage from './springDataRestResponseToPage';
import withFetchArgsInState from './withFetchArgsInState';
import withPageInState, {FetchReason} from './withPageInState';

export {
  // API interfaces and models
  Action,
  ActionButtonPropsType,
  FetchArgs,
  FetchReason,
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
