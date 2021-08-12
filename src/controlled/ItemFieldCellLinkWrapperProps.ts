import {ReactNode} from 'react';

import FieldModel from '../FieldModel';

interface ItemFieldCellLinkWrapperProps<T, V, F> {
  children?: ReactNode;
  field: FieldModel<T, V, F>;
  hyperlink: string;
  item: T;
}

export default ItemFieldCellLinkWrapperProps;
