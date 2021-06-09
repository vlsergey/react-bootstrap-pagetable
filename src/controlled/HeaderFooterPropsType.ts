import FetchArgs from '../FetchArgs';
import Page from '../Page';

interface HeaderFooterPropsType<T> {
  fetchArgs: FetchArgs;
  page: Page<T>;
  size?: 'lg' | 'sm';
  onFetchArgsChange: (fetchArgs: FetchArgs) => unknown;
}

export default HeaderFooterPropsType;
