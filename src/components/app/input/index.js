import React, { forwardRef } from 'react';

import styles from './styles.module.scss';

export default forwardRef(function Input({ onEnter, ...props }, ref) {
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.stopPropagation();
      event.preventDefault();
      if (onEnter) {
        onEnter();
      }
    }
  };

  return (
    <input
      className={styles.input}
      onKeyDown={handleKeyDown}
      ref={ref}
      {...props}
    />
  );
});
