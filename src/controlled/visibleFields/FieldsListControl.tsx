import React, {useCallback} from 'react';
import Form from 'react-bootstrap/Form';

import FieldModel from '../../FieldModel';

interface PropsType {
  options: FieldModel<unknown, unknown>[];
  placeholder: string;
  selected: string[];
  onSelectedChange: (selected: string[]) => unknown;
}

const FieldsListControl = ({
  onSelectedChange,
  options,
  placeholder,
  selected,
}: PropsType) => {

  const handleSelectChange = useCallback(({currentTarget}: React.ChangeEvent<HTMLSelectElement>) =>
    onSelectedChange([...(currentTarget.options as unknown as [])]
      .filter(({selected}) => selected).map(({value}) => value)), [onSelectedChange]);

  return <Form.Control
    as="select"
    htmlSize={10}
    multiple
    onChange={handleSelectChange}
    style={{height: options.length === 0 ? '15em' : undefined}}
    value={selected}>
    {options.length === 0 && <option disabled key="" style={{whiteSpace: 'break-spaces'}} value="">
      {placeholder}
    </option>}
    {options.map(field =>
      <option
        key={field.key}
        value={field.key}>
        {field.title}
      </option>
    )}
  </Form.Control>;
};

export default React.memo(FieldsListControl);
