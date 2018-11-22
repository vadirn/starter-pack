import { useState } from 'react';

export function useFormInput(initialValue) {
  const [inputValue, setInputValue] = useState(initialValue);

  function onChange(evt) {
    const { type, name, value, checked } = evt.target;
    if (type === 'checkbox') {
      setInputValue(Object.assign(inputValue, { [name]: checked }));
    } else {
      setInputValue(value);
    }
  }

  return {
    value: inputValue,
    onChange,
  };
}
