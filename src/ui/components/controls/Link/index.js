import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export function PureLink({ onClick, href, children, className, rel, download }) {
  return (
    <a className={c(s.container, className)} href={href} onClick={onClick} rel={rel} download={download}>
      {children}
    </a>
  );
}

PureLink.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  rel: PropTypes.string,
  download: PropTypes.string,
};

export const Link = React.memo(PureLink);
