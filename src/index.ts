import FieldModel, {FieldFilterCellRenderer, FieldFilterValueConverter}
  from './FieldModel';
import Page, {emptyPage, singlePage} from './Page';
import Action from './actions/Action';
import ControlledBase from './ControlledBase';
import FetchArgs from './FetchArgs';
import fetchFromArray from './fetchFromArray';
import fetchFromSpringDataRest from './fetchFromSpringDataRest';
import ItemModel from './ItemModel';
import springDataRestResponseToPage from './springDataRestResponseToPage';
import withActions from './actions';
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
  FieldFilterCellRenderer,
  FieldFilterValueConverter,
  FieldModel,
  ItemModel,
  Page,

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
};

// Main mixins (what user is advised to use)
export const ControlledPageTable = withActions(withSortable(withFilterable(withSelectable(ControlledBase))));
export const UncontrolledPageTable = withFetchArgsInState(withPageInState(ControlledPageTable));
export const ControlledWithReactRouter = withReactRouter(ControlledPageTable);
export const UncontrolledWithReactRouter = withReactRouter(withPageInState(ControlledPageTable));

export default UncontrolledPageTable;
