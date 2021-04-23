import { ReactNode } from 'react';

interface Action<T> {
  enabled : ( items : T[] ) => boolean;
  key : string;
  /** Execute action on specified items. Can return Promise */
  onAction : ( items : T[] ) => unknown;
  /** Shall we refresh page table content after action completed? */
  refreshAfterAction? : boolean;
  /** Title for button under the pagetable */
  title : ReactNode;
  /** What shall be variant for button under the pagetable */
  variant? : string;
  visible? : ( items : T[] ) => boolean;
}

export default Action;
