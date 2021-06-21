import React, {useCallback, useMemo, useState} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FieldModel from '../FieldModel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import {useControlledContext} from './ControlledContext';

interface FieldsListControlPropsType {
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
}: FieldsListControlPropsType) => {

  const handleSelectChange = useCallback(({currentTarget}: React.ChangeEvent<HTMLSelectElement>) =>
    onSelectedChange([ ...(currentTarget.options as unknown as []) ]
      .filter(({selected}) => selected).map(({value}) => value)), [ onSelectedChange ]);

  const selectedSet: Set<string> = useMemo(() => new Set(selected), [ selected ]);

  return <Form.Control
    as="select"
    htmlSize={10}
    multiple
    onChange={handleSelectChange}
    style={{height: options.length === 0 ? '15em' : undefined}}>
    {options.length === 0 && <option disabled key="" style={{whiteSpace: 'break-spaces'}} value="">
      {placeholder}
    </option>}
    {options.map(field =>
      <option
        key={field.key}
        selected={selectedSet.has(field.key)}
        value={field.key}>
        {field.title}
      </option>
    )}
  </Form.Control>;
};

const VisibleFieldsSettings = (): JSX.Element => {
  const {disableVisibleFieldsChange,
    itemModel,
    onVisibleFieldsChange,
    size,
    visibleFields} = useControlledContext();
  const [ show, setShow ] = useState(false);

  const fieldsMap: Map<string, FieldModel<unknown, unknown>> = useMemo(() =>
    new Map(itemModel.fields.map(field => [ field.key, field ])), [ itemModel.fields ]);

  const visibleFieldsSet: Set<string> = useMemo(() => new Set(visibleFields),
    [ visibleFields ]);

  const handleShow = useCallback(() => setShow(true), [ setShow ]);
  const handleHide = useCallback(() => setShow(false), [ setShow ]);

  const available = useMemo(() =>
    itemModel.fields.filter(({key}) => !visibleFieldsSet.has(key)), [ itemModel, visibleFieldsSet ]);

  const visible = useMemo(() =>
    visibleFields.map(fieldKey => fieldsMap.get(fieldKey)).filter(field => !!field),
  [ visibleFields, fieldsMap ]);

  const [ availableSelected, setAvailableSelected ] = useState<string[]>([]);
  const [ visibleSelected, setVisibleSelected ] = useState<string[]>([]);

  const handleAllToRight = useCallback(() => {
    onVisibleFieldsChange([ ...visibleFields, ...available.map(({key}) => key) ]);
    setAvailableSelected([]);
  }, [ available, onVisibleFieldsChange, visibleFields ]);

  const handleToRight = useCallback(() => {
    onVisibleFieldsChange([ ...visibleFields, ...availableSelected ]);
    setAvailableSelected([]);
  }, [ onVisibleFieldsChange, setAvailableSelected, visibleFields, availableSelected ]);

  const handleToLeft = useCallback(() => {
    onVisibleFieldsChange(visibleFields.filter(fieldKey => !visibleSelected.includes(fieldKey)));
    setVisibleSelected([]);
  }, [ onVisibleFieldsChange, visibleFields, visibleSelected, setVisibleSelected ]);

  const handleAllToLeft = useCallback(() => {
    onVisibleFieldsChange([]);
    setVisibleSelected([]);
  }, [ onVisibleFieldsChange, setVisibleSelected ]);

  const handleReset = useCallback(() => {
    const defaultFields = itemModel.fields
      .filter(({hiddenByDefault}) => !hiddenByDefault).map(({key}) => key);
    onVisibleFieldsChange(defaultFields);
    setAvailableSelected([]);
    setVisibleSelected([]);
  }, [ itemModel, onVisibleFieldsChange, setAvailableSelected, setVisibleSelected ]);

  if (disableVisibleFieldsChange) {
    return null;
  }

  return <>
    <Button onClick={handleShow} size={size} variant="light">
      <i className="fas fa-cog" />
    </Button>
    <Modal onHide={handleHide} show={show}>
      <Modal.Dialog style={{margin: 0, width: '100%'}}>
        <Modal.Header closeButton>
          <Modal.Title>Manage displayed columns</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <FieldsListControl
                  onSelectedChange={setAvailableSelected}
                  options={available}
                  placeholder="All fields are selected to display. Select and move some fields from right part of the dialog to hide their columns."
                  selected={availableSelected} />
              </Col>
              <Col as={ButtonGroup} lg={1} style={{height: 'fit-content', padding: 0}} vertical>
                <Button disabled={available.length === 0} onClick={handleAllToRight} variant="light">
                  <i className="fa fa-angle-double-right" />
                </Button>
                <Button disabled={availableSelected.length === 0} onClick={handleToRight} variant="light">
                  <i className="fa fa-angle-right" />
                </Button>
                <Button disabled={visibleSelected.length === 0} onClick={handleToLeft} variant="light">
                  <i className="fa fa-angle-left" />
                </Button>
                <Button disabled={visible.length === 0} onClick={handleAllToLeft} variant="light">
                  <i className="fa fa-angle-double-left" />
                </Button>
              </Col>
              <Col>
                <FieldsListControl
                  onSelectedChange={setVisibleSelected}
                  options={visible}
                  placeholder="Move fields here to show their columns."
                  selected={visibleSelected} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleReset} variant="secondaty">Reset to defaults</Button>
          <Button onClick={handleHide} variant="primary">Close</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  </>;
};

export default React.memo(VisibleFieldsSettings);
