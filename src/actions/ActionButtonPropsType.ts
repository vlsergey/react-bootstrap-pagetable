import {ButtonProps}
  from 'react-bootstrap/Button';

interface ActionButtonPropsType {
  children: ButtonProps['children'];
  disabled: ButtonProps['disabled'];
  onClick: (...etc: unknown[]) => unknown;
  size?: ButtonProps['size'];
  variant: ButtonProps['variant'];
}

export default ActionButtonPropsType;
