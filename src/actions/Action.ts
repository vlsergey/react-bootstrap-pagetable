import {ReactNode} from 'react';

import ActionButtonPropsType from './ActionButtonPropsType';

interface Action<T> {
  enabled: (items: T[]) => boolean;
  /** Unique action key */
  key: string;
  /** Execute action on specified items. Can return Promise */
  onAction: (items: T[], ...etc: unknown[]) => unknown;
  /** Shall we refresh page table content after action completed? */
  refreshAfterAction?: boolean;
  /** Component that will be drawn instead of Button */
  buttonComponent?: (props: ActionButtonPropsType<T>) => JSX.Element;
  /** Title for button under the pagetable */
  title: ReactNode;
  /** What shall be variant for button under the pagetable */
  variant?: string;
  visible?: (items: T[]) => boolean;
}

export default Action;
