import ControlledContext, {ControlledContextType, useControlledContext}
  from './controlled/ControlledContext';
import DefaultItemFieldCellRenderer,
{PropsType as DefaultItemFieldCellRendererPropsType}
  from './controlled/DefaultItemFieldCellRenderer';
import FieldModel, {FilterCellRendererProps, FilterValueConverter,
  ValueGetter, ValueRendererProps} from './FieldModel';
import Page, {emptyPage, singlePage} from './Page';
import Action from './actions/Action';
import ControlledBase from './controlled';
import DefaultHeaderFooter from './controlled/DefaultHeaderFooter';
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
import useVisibleFields from './controlled/useVisibleFields';
import VisibleFieldsSettings from './controlled/VisibleFieldsSettings';
import withActions from './actions/withActions';
import withFetchArgsInState from './withFetchArgsInState';
import withFilterable from './filterable/withFilterable';
import withPageInState from './withPageInState';
import withReactRouter from './reactRouter/withReactRouter';
import withSelectable from './withSelectable';
import withSortable from './sortable';

export {
  // API interfaces and models
  Action,
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
  DefaultRowsRenderer, DefaultHeaderFooter, PageIndexSelector, PageSizeSelector, VisibleFieldsSettings,
};

// Main mixins (what user is advised to use)
export const ControlledPageTable = withActions(withSortable(withFilterable(withSelectable(ControlledBase))));
export const UncontrolledPageTable = withFetchArgsInState(withPageInState(ControlledPageTable));
export const ControlledWithReactRouter = withReactRouter(ControlledPageTable);
export const UncontrolledWithReactRouter = withReactRouter(withPageInState(ControlledPageTable));

export default UncontrolledPageTable;
