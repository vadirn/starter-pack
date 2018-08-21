import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

export default function SwitchButton({ left: _left, right: _right, className, ...props }) {
  let left = null;
  if (_left) {
    left = <div className="m-u-r float-left">{_left}</div>;
  }
  let right = null;
  if (_right) {
    right = <div className="m-u-l float-right">{_right}</div>;
  }
  return (
    <label className={c('block w-content relative', className, s.container)}>
      <input className={s.checkbox} type="checkbox" value="" {...props} />
      <div className={c('relative z1', s.label)}>
        {left}
        <div className={c('relative', s['icon-container'])}>
          <div className={c('absolute top-0 left-0 right-0 bottom-0', s['icon-container-backdrop'])} />
          <div className={c('relative', s['icon-circle'])}>
            <div className={c('absolute top-0 left-0 right-0 bottom-0', s['icon-circle-backdrop'])} />
          </div>
        </div>
        {right}
      </div>
      <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
    </label>
  );
}

SwitchButton.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  onChange: PropTypes.func,
};
