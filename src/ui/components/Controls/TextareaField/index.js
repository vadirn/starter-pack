import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

export default class TextareaField extends React.PureComponent {
  render() {
    const { value: val, className, ...props } = this.props;
    let value = '';
    if (val) {
      value = val;
    }
    return (
      <div className={c('relative', className)}>
        <textarea rows="3" className={c('relative z1 p-u', s.textarea)} value={value} {...props} />
        <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
      </div>
    );
  }
}

TextareaField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
