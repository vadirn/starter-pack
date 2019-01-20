import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export function PureRadioButton({ value: _value, label, className, ...props }) {
  let value = '';
  if (_value) {
    value = _value;
  }
  return (
    <label className={c('block w-content relative', className, s.container)}>
      <input className={s.radio} type="radio" value={value} {...props} />
      <div className={c('relative z1', s.label)}>
        <div className={c('inline-block w-m h-m relative m-u-r', s.icon)}>
          <div className={c('absolute top-0 left-0 right-0 bottom-0', s['icon-backdrop'])} />
        </div>
        {label}
      </div>
      <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
    </label>
  );
}

PureRadioButton.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const RadioButton = React.memo(PureRadioButton);
