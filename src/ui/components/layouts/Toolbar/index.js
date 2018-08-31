import React from 'react';
import c from 'classnames';
import PropTypes from 'prop-types';
import s from './styles.css';

export default function Toolbar({ className, left, middle, right }) {
  return (
    <div className={c('flex flex-ycenter', s.container, className)}>
      <div className="flex flex-grow-1">{left}</div>
      <div className="flex-self-center">{middle}</div>
      <div className="flex-grow-1">
        <div className="float-right">{right}</div>
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  className: PropTypes.string,
  left: PropTypes.node,
  middle: PropTypes.node,
  right: PropTypes.node,
};
