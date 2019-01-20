import { Button } from 'components/controls/Button';
import { TextField } from 'components/controls/TextField';
import { useFormInput } from 'form-hooks';
import React from 'react';

export function FormHooks() {
  const text = useFormInput('');

  function handleSubmit(evt) {
    evt.preventDefault();
    console.log({ text: text.value });
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="text" className="m-s-b" placeholder="Text field" {...text} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
