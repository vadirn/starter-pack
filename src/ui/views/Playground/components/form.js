import React from 'react';
import Form from 'components/Form';
import TextField from 'components/Form/TextField';
import Errors from 'components/Form/Errors';
import c from 'classnames';

class ExampleForm extends Form {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(evt) {
    evt.preventDefault();
  }
  render() {
    // const { defaultValues } = this.props;
    return (
      <form onSubmit={this.handleSubmit} style={{ width: '320px' }}>
        <div className="m-s-b">
          <label htmlFor="example-form-text">
            <span className={c({ bold: this.isFieldModified('text') })}>Text input</span>
            <TextField
              id="example-form-text"
              name="text"
              value={this.state['text']}
              onChange={this.handleChange}
              autoComplete="off"
            />
          </label>
          <Errors value={this.props.fieldErrors['text']} />
        </div>
      </form>
    );
  }
}

export default function PlaygroundItem() {
  return (
    <ExampleForm
      defaultValues={{ text: '' }}
      fieldErrors={{ text: ['First error', 'Second error'] }}
      errors={['Please fix all errors']}
    />
  );
}
