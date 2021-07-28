import {ReactNode} from 'react';

import FieldModel from '../FieldModel';

interface ItemFieldCellLinkWrapperProps<T, V> {
  children?: ReactNode;
  field: FieldModel<T, V>;
  hyperlink: string;
  item: T;
}

export default ItemFieldCellLinkWrapperProps;
