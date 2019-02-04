import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export function PureSwitchButton({ left, right, className, ...props }) {
  return (
    <label className={c('block w-content relative', className, s.container)}>
      <input className={s.checkbox} type="checkbox" value="" {...props} />
      <div className={c('relative z-1', s.label)}>
        {left}
        <div
          className={c('relative inline-block text-valign-top', s['icon-container'], {
            'm-u-l': !!left,
            'm-u-r': !!right,
          })}>
          <div className={c('absolute', s.icon)}>
            <div className={c('absolute-fill', s['icon-backdrop'])} />
          </div>
        </div>
        {right}
      </div>
      <div className={c('absolute-fill', s.backdrop)} />
    </label>
  );
}

PureSwitchButton.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export const SwitchButton = React.memo(PureSwitchButton);
