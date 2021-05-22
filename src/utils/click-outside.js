import React from 'react';

export default function HandleClickOutside ({ children, visible, onClose }) {
  const ref = React.createRef();

  function handleClickOutside (event) {
    if (ref.current && !ref.current.contains(event.target)) {
      onClose();
    }
  }

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);

  return visible && React.cloneElement(children, {
    ref: ref,
  });
}
