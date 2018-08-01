import React from 'react';
import PropTypes from 'prop-types';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.defaultValues;

    this.isFormModified = this.isFormModified.bind(this);
    this.isFieldModified = this.isFieldModified.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  isFormModified() {
    for (const fieldName of Object.keys(this.props.defaultValues)) {
      if (this.isFieldModified(fieldName)) {
        return true;
      }
    }
    return false;
  }
  isFieldModified(name) {
    return this.state[name] !== this.props.defaultValues[name];
  }
  handleChange(evt) {
    const { type, name, value, checked } = evt.target;
    if (type === 'checkbox') {
      this.setState(() => {
        return { [`${name}[${value}]`]: checked };
      });
    } else {
      this.setState(() => {
        return { [name]: value };
      });
    }
  }
}

Form.propTypes = {
  defaultValues: PropTypes.object.isRequired,
  fieldErrors: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
};
