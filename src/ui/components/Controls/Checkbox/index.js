import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';
import Icon, { ICONS } from 'components/other/Icon';

export default class Checkbox extends React.PureComponent {
  render() {
    const { value: _value, label, className, ...props } = this.props;
    let value = '';
    if (_value) {
      value = _value;
    }
    return (
      <label className={c('block w-content relative', className, s.container)}>
        <input className={s.checkbox} type="checkbox" value={value} {...props} />
        <div className={c('relative z1', s.label)}>
          <div className={c('inline-block relative m-u-r', s.icon)}>
            <div className={c('absolute top-0 left-0 right-0 bottom-0', s['icon-backdrop'])} />
            <Icon className="relative" path={ICONS.M.CHECKMARK} stroke={2} />
          </div>
          {label}
        </div>
        <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
      </label>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
