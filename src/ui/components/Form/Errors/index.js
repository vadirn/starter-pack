import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

export default function Errors({ value }) {
  if (value === undefined || (value && value.length === 0)) {
    return null;
  }
  return (
    <ul className={c('fs-s m-u-t', s.list)}>
      {value.map((err, idx) => (
        <li key={idx.toString()}>{err}</li>
      ))}
    </ul>
  );
}

Errors.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
};
