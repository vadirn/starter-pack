import React from 'react';
import { useFormInput } from 'form-hooks';
import TextField from 'components/controls/TextField';
import Button from 'components/controls/Button';

export default function FormHooks() {
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
