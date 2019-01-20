import c from 'classnames';
import { Toolbar } from 'components/layouts/Toolbar';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export function PureButton(props = {}) {
  const { children, className, left, right, look = 'default', ...etc } = props;
  return (
    <button className={c('relative p-u-l p-u-r p-u-b p-u-t', className, s[look])} {...etc}>
      <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
      <div className="relative z1">
        <Toolbar left={left} right={right} middle={<div className={c('p-u-l p-u-r', s.content)}>{children}</div>} />
      </div>
    </button>
  );
}

PureButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  left: PropTypes.node,
  right: PropTypes.node,
  look: PropTypes.string,
};

export const Button = React.memo(PureButton);
