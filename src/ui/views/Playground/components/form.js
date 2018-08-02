import React from 'react';
import Form from 'components/Form';
import TextField from 'components/Form/TextField';
import TextareaField from 'components/Form/TextareaField';
import RadioButton from 'components/Form/RadioButton';
import Checkbox from 'components/Form/Checkbox';
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
        <div className="m-s-b">
          <label htmlFor="example-form-textarea">
            <span className={c({ bold: this.isFieldModified('textarea') })}>Textarea</span>
            <TextareaField
              id="example-form-textarea"
              name="textarea"
              value={this.state['textarea']}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <div className="m-s-b">
          <span className={c({ bold: this.isFieldModified('radio') })}>Radio</span>
          <RadioButton
            name="radio"
            value="one"
            checked={this.state['radio'] === 'one'}
            label="One giant"
            onChange={this.handleChange}
          />
          <RadioButton
            name="radio"
            value="two"
            checked={this.state['radio'] === 'two'}
            label="Second giant"
            onChange={this.handleChange}
          />
        </div>
        <div className="m-s-b">
          <span className={c({ bold: this.isAnyFieldModified(fieldName => fieldName.startsWith('checkbox')) })}>
            Checkbox
          </span>
          <Checkbox
            name="checkbox[one]"
            value="one"
            checked={!!this.state['checkbox[one]']}
            label="Macaroni"
            onChange={this.handleChange}
          />
          <Checkbox
            name="checkbox[two]"
            value="two"
            checked={!!this.state['checkbox[two]']}
            label="Spaghetti"
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  }
}

export default function PlaygroundItem() {
  return (
    <ExampleForm
      defaultValues={{ text: '', textarea: '', radio: '', 'checkbox[one]': false, 'checkbox[two]': true }}
      fieldErrors={{ text: ['First error', 'Second error'] }}
      errors={['Please fix all errors']}
    />
  );
}
