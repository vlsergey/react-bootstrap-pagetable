import React, {useCallback} from 'react';
import Form from 'react-bootstrap/Form';

import {useControlledContext} from './ControlledContext';

export type PropsType = Omit<React.ComponentProps<'select'>, 'onChange' | 'ref' | 'size' | 'value'>;

const PageSizeSelector = ({name = 'size', ...etc}: PropsType): JSX.Element => {
  const {fetchArgs, onFetchArgsChange, size} = useControlledContext();

  const handleChange = useCallback(({currentTarget}: React.ChangeEvent<HTMLSelectElement>) =>
    onFetchArgsChange({...fetchArgs, size: Number(currentTarget.value)}), [fetchArgs, onFetchArgsChange]);

  return <Form.Control
    {...etc}
    as="select"
    name={name}
    onChange={handleChange}
    size={size}
    value={fetchArgs.size}>
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </Form.Control>;
};

export default React.memo(PageSizeSelector);
