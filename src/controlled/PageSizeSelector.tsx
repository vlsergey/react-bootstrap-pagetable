import React, {useCallback} from 'react';
import Form from 'react-bootstrap/Form';

export interface PropsType
    extends Omit<React.ComponentProps<'select'>, 'onChange' | 'ref' | 'size' | 'value'> {
  value: number;
  name?: string;
  onChange: (newValue: number) => unknown;
  size?: 'lg' | 'sm';
}

const PageSizeSelector = ({onChange, name = 'size', value, size, ...etc}: PropsType) => {
  const handleChange = useCallback(({currentTarget}: React.ChangeEvent<HTMLSelectElement>) =>
    onChange(Number(currentTarget.value)), [ onChange ]);

  return <Form.Control
    {...etc}
    as="select"
    name={name}
    onChange={handleChange}
    size={size}
    value={value}>
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </Form.Control>;
};

export default React.memo(PageSizeSelector);
