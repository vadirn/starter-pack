import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

export default class SwitchButton extends React.PureComponent {
  render() {
    const { left, right, className, ...props } = this.props;
    return (
      <label className={c('block w-content relative', className, s.container)}>
        <input className={s.checkbox} type="checkbox" value="" {...props} />
        <div className={c('relative z1', s.label)}>
          {left}
          <div
            className={c('relative inline-block text-valign-top', s['icon-container'], {
              'm-u-l': !!left,
              'm-u-r': !!right,
            })}>
            <div className={c('absolute', s.icon)}>
              <div className={c('absolute top-0 left-0 right-0 bottom-0', s['icon-backdrop'])} />
            </div>
          </div>
          {right}
        </div>
        <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
      </label>
    );
  }
}

SwitchButton.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  onChange: PropTypes.func,
};
