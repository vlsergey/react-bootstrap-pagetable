import React, {ReactNode, useCallback, useState} from 'react';
import Form from 'react-bootstrap/Form';

type ReturnType = [ boolean, JSX.Element ];

export default function useBooleanOption (
    key: string,
    label: ReactNode
): ReturnType {
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheckboxChange = useCallback(({currentTarget: {checked}}: React.ChangeEvent<HTMLInputElement>) =>
  { setChecked(!!checked); }
  , [setChecked]);

  const element = <Form.Check
    checked={checked}
    id={'ctrld_chk_' + key}
    label={label}
    name={key}
    onChange={handleCheckboxChange}
    type="checkbox" />;

  return [checked, element];
}
