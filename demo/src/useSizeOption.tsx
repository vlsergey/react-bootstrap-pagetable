import React, {useCallback, useState} from 'react';
import Form from 'react-bootstrap/Form';

type ReturnType = [ 'lg' | 'sm', JSX.Element ];

export default function useSizeOption (): ReturnType {
  const [size, setSize] = useState<'lg' | 'sm'>(null);

  const handleChange = useCallback(({currentTarget: {value}}: React.ChangeEvent<HTMLSelectElement>) =>
  { setSize((value || null) as ('lg' | 'sm')); }
  , [setSize]);

  const element = <Form.Group className="form-inline" controlId="size">
    <Form.Label style={{paddingRight: '1em'}}>Size:</Form.Label>
    <Form.Control as="select" name="size" onChange={handleChange} size="sm" value={size || ''}>
      <option value="sm">sm</option>
      <option value="" />
      <option value="lg">lg</option>
    </Form.Control>
  </Form.Group>;

  return [size, element];
}
