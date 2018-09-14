import c from 'classnames';
import Toolbar from 'components/layouts/Toolbar';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export default class Button extends React.PureComponent {
  render() {
    const { children, className, left, right, look, ...props } = this.props;
    return (
      <button className={c('relative p-u-l p-u-r p-u-b p-u-t', className, s.container, s[look])} {...props}>
        <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
        <div className="relative z1">
          <Toolbar left={left} right={right} middle={<div className="p-u-l p-u-r">{children}</div>} />
        </div>
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
};
