import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export function PureTextareaField({ value: val, className, ...props }) {
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

PureTextareaField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const TextareaField = React.memo(PureTextareaField);
