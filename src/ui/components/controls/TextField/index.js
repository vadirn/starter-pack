import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export function PureTextField({ value: val, className, ...props }) {
  let value = '';
  if (val) {
    value = val;
  }
  return (
    <div className={c('relative', className)}>
      <input className="relative z-1 p-u" type="text" value={value} {...props} />
      <div className={c('absolute-fill', s.backdrop)} />
    </div>
  );
}

PureTextField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export const TextField = React.memo(PureTextField);
