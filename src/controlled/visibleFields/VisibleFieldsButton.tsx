import React, {useCallback, useState} from 'react';
import Button from 'react-bootstrap/Button';

import {useControlledContext} from '../ControlledContext';
import VisibleFieldsModal from './VisibleFieldsModal';

function VisibleFieldsButton<T> (): JSX.Element {
  const {disableVisibleFieldsChange, size} = useControlledContext<T>();
  const [show, setShow] = useState(false);

  const handleShow = useCallback(() => { setShow(true); }, [setShow]);
  const handleHide = useCallback(() => { setShow(false); }, [setShow]);

  if (disableVisibleFieldsChange) {
    return null as unknown as JSX.Element;
  }

  return <>
    <Button onClick={handleShow} size={size} variant="light">
      <i className="fas fa-cog" />
    </Button>
    <VisibleFieldsModal onHide={handleHide} show={show} />
  </>;
}

export default React.memo(VisibleFieldsButton);
