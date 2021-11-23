import {ButtonProps}
  from 'react-bootstrap/Button';

interface ActionButtonPropsType<T> {
  children: ButtonProps['children'];
  disabled: ButtonProps['disabled'];
  selectedItems: T[];
  onClick: (...etc: unknown[]) => unknown;
  size?: ButtonProps['size'];
  variant: ButtonProps['variant'];
}

export default ActionButtonPropsType;
