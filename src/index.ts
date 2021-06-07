import DefaultItemFieldCellRenderer,
{PropsType as DefaultItemFieldCellRendererPropsType}
  from './controlled/DefaultItemFieldCellRenderer';
import DefaultRowsRenderer, {PropsType as RowsRendererPropsType}
  from './controlled/DefaultRowsRenderer';
import FieldModel, {FilterCellRendererProps, FilterValueConverter,
  ValueGetter, ValueRendererProps} from './FieldModel';
import Page, {emptyPage, singlePage} from './Page';
import Action from './actions/Action';
import ControlledBase from './controlled';
import FetchArgs from './FetchArgs';
import fetchFromArray from './fetchFromArray';
import fetchFromSpringDataRest from './fetchFromSpringDataRest';
import FieldFilterCell from './FieldFilterCell';
import ItemFieldCellRendererPropsType
  from './controlled/ItemFieldCellRendererPropsType';
import ItemFieldValue from './ItemFieldValue';
import ItemModel from './ItemModel';
import springDataRestResponseToPage from './springDataRestResponseToPage';
import withActions from './actions/withActions';
import withFetchArgsInState from './withFetchArgsInState';
import withFilterable from './withFilterable';
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
  ItemFieldCellRendererPropsType, DefaultItemFieldCellRenderer, DefaultItemFieldCellRendererPropsType,
  DefaultRowsRenderer, RowsRendererPropsType,
};

// Main mixins (what user is advised to use)
export const ControlledPageTable = withActions(withSortable(withFilterable(withSelectable(ControlledBase))));
export const UncontrolledPageTable = withFetchArgsInState(withPageInState(ControlledPageTable));
export const ControlledWithReactRouter = withReactRouter(ControlledPageTable);
export const UncontrolledWithReactRouter = withReactRouter(withPageInState(ControlledPageTable));

export default UncontrolledPageTable;
