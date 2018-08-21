import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

export default function Button({ children, ...props }) {
  return (
    <button className={c('relative p-s-l p-s-r p-u-b p-u-t', s.container)} {...props}>
      <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
      <div className="relative z1">{children}</div>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
};
