import { useRef, useState } from 'react';

import Input from 'components/app/input';
import Button from 'components/app/button';

import styles from './styles.module.scss';
import cn from 'classnames';

export default function Form ({ title, inputsData, onSubmit, button, popup }) {
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);

  const validateBeforeSubmit = () => {
    const newErrors = inputsData.reduce((total, input, index) => {
      for (const rule of input.rules) {
        if (!rule.rule(input.value)) {
          return Object.assign(total, {
            [index]: rule.message,
          });
        }
      }
      return total;
    }, {});

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    }
  };

  const getSetFocusOnNext = (index) => () => {
    for (const rule of inputsData[index].rules) {
      if (rule.rule(inputsData[index].value)) {
        const { [index]: valid, ...restErrors } = errors;
        setErrors(restErrors);
      } else {
        setErrors({
          ...errors,
          [index]: rule.message,
        });
        return;
      }
    }

    if (index + 1 === inputsData.length) {
      validateBeforeSubmit();
    } else {
      inputRefs.current[index+1].focus();
    }
  };

  const setToRefs = (index) => (el) => {
    inputRefs.current[index] = el;
  };

  return (
    <div className={styles.form}>
      <div className={styles.wrapper}>
        <div className={styles.title}>{title}</div>
        {inputsData.map(({ label, type, value, onChange, validator, required, onEnter, placeholder }, i) => {
          if (type === 'text' || type === 'password') {
            return <div
              key={i}
              className={styles.field}
            >
              <div className={styles.fieldLabel}>{label}</div>
              <div className={styles.fieldInput}>
                <Input
                  key={i}
                  ref={setToRefs(i)}
                  type={type}
                  value={value}
                  onChange={event => onChange(event.target.value)}
                  onEnter={getSetFocusOnNext(i)}
                  validator={validator}
                  placholder={placeholder}
                />
              </div>
              <div className={styles.fieldError}>{errors[i] && errors[i]}</div>
            </div>;
          }
        })}
        {popup && (
          <div className={cn(styles.popup, {
            [styles.popupSuccess]: popup.success,
            [styles.popupError]: !popup.success,
          })}>
            <div className={cn(styles.wrapper, styles.popupWrapper)}>
              <div>{popup.success ? 'Success' : 'Error'}:</div>
              <div className={styles.popupMessage}>{popup.message}</div>
            </div>
          </div>
        )}
        <div className={styles.submit}>
          <Button
            label={button}
            onClick={validateBeforeSubmit}
          />
        </div>
      </div>
    </div>
  );
}
