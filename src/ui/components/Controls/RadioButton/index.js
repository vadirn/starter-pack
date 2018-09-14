import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

export default class RadioButton extends React.PureComponent {
  render() {
    const { value: _value, label, className, ...props } = this.props;
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
}

RadioButton.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
