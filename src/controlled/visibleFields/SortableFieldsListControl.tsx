import React, {useCallback} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';

import FieldModel from '../../FieldModel';
import FieldsListControl from './FieldsListControl';

interface PropsType {
  options: FieldModel<unknown, unknown>[];
  onOptionsChange: (options: string[]) => unknown;
  placeholder: string;
  selected: string[];
  onSelectedChange: (selected: string[]) => unknown;
}

const SortableFieldsListControl = ({
  onSelectedChange,
  options,
  onOptionsChange,
  placeholder,
  selected,
}: PropsType) => {

  const handleTop = useCallback(() =>
    onOptionsChange([...selected, ...options.map(({key}) => key).filter(key => !selected.includes(key))]),
  [onOptionsChange, options, selected]);

  const handleUp = useCallback(() => {
    const newResult = options.map(({key}) => key);
    for (let i = 1; i < newResult.length; i++) {
      if (selected.includes(newResult[i])) {
        [newResult[i - 1], newResult[i]] = [newResult[i], newResult[i - 1]];
      }
    }
    return onOptionsChange(newResult);
  }, [onOptionsChange, options, selected]);

  const handleDown = useCallback(() => {
    const newResult = options.map(({key}) => key);
    for (let i = newResult.length - 2; i >= 0; i--) {
      if (selected.includes(newResult[i])) {
        [newResult[i], newResult[i + 1]] = [newResult[i + 1], newResult[i]];
      }
    }
    return onOptionsChange(newResult);
  }, [onOptionsChange, options, selected]);

  const handleBottom = useCallback(() =>
    onOptionsChange([...options.map(({key}) => key).filter(key => !selected.includes(key)), ...selected]),
  [onOptionsChange, options, selected]);

  return <>
    <Col>
      <FieldsListControl
        onSelectedChange={onSelectedChange}
        options={options}
        placeholder={placeholder}
        selected={selected} />
    </Col>
    <Col as={ButtonGroup} lg={1} style={{height: 'fit-content', padding: 0}} vertical>
      <Button disabled={selected.length === 0} onClick={handleTop} variant="light">
        <i className="fa fa-angle-double-up" />
      </Button>
      <Button disabled={selected.length === 0} onClick={handleUp} variant="light">
        <i className="fa fa-angle-up" />
      </Button>
      <Button disabled={selected.length === 0} onClick={handleDown} variant="light">
        <i className="fa fa-angle-down" />
      </Button>
      <Button disabled={selected.length === 0} onClick={handleBottom} variant="light">
        <i className="fa fa-angle-double-down" />
      </Button>
    </Col>
  </>;
};

export default React.memo(SortableFieldsListControl);
