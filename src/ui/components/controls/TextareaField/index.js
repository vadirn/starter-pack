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
      <textarea rows="3" className={c('relative z-1 p-u', s.textarea)} value={value} {...props} />
      <div className={c('absolute-fill', s.backdrop)} />
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
