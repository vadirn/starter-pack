import React from 'react';
import Form from 'components/controls/Form';
import TextField from 'components/controls/TextField';
import TextareaField from 'components/controls/TextareaField';
import RadioButton from 'components/controls/RadioButton';
import Checkbox from 'components/controls/Checkbox';
import Button from 'components/controls/Button';
import Errors from 'components/lists/Errors';
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
      <form className="m-m-b" onSubmit={this.handleSubmit} style={{ width: '320px' }}>
        <div className="m-m-b bg-debug">
          <label htmlFor="example-form-text" className="bg-debug">
            <div className={c('m-u-b bg-debug')}>Text input</div>
            <TextField
              id="example-form-text"
              name="text"
              value={this.state['text']}
              onChange={this.handleChange}
              autoComplete="off"
            />
          </label>
          <Errors className="bg-debug" value={this.props.fieldErrors['text']} />
        </div>
        <div className="m-m-b">
          <label htmlFor="example-form-textarea">
            <div className={c('m-u-b')}>Textarea</div>
            <TextareaField
              id="example-form-textarea"
              name="textarea"
              value={this.state['textarea']}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <div className="m-m-b">
          <div className={c('m-u-b')}>Radio</div>
          <RadioButton
            className="m-u-b"
            name="radio"
            value="one"
            checked={this.state['radio'] === 'one'}
            label="One giant"
            onChange={this.handleChange}
          />
          <RadioButton
            className="m-u-b"
            name="radio"
            value="two"
            checked={this.state['radio'] === 'two'}
            label="Second giant"
            onChange={this.handleChange}
          />
        </div>
        <div className="m-m-b">
          <div className={c('m-u-b')}>Checkbox</div>
          <Checkbox
            className="m-u-b"
            name="checkbox[one]"
            value="one"
            checked={!!this.state['checkbox[one]']}
            label="Macaroni"
            onChange={this.handleChange}
          />
          <Checkbox
            className="m-u-b"
            name="checkbox[two]"
            value="two"
            checked={!!this.state['checkbox[two]']}
            label="Spaghetti"
            onChange={this.handleChange}
          />
        </div>
        <Button type="button">Example button</Button>
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
