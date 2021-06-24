import React, {useEffect, useRef, useState} from 'react';

export default function DivHideIfEmpty (props: React.ComponentProps<'div'>): JSX.Element {
  const ref = useRef<HTMLDivElement>();
  const [ hide, setHide ] = useState(false);

  useEffect(() =>
    setHide(ref.current &&
      (!ref.current.innerHTML || /^(<(div|span)>)*(<\/(div|span)>)*$/.test(ref.current.innerHTML)))
  , [ setHide, props ]);

  if (hide) {
    return null;
  }

  return <div {...props} ref={ref} />;
}
