import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';
import { withConsumer } from 'main';

export function Link({ onClick, href, children }) {
  return (
    <a className={s.container} href={href} onClick={onClick}>
      <div className="relative inline-block">
        <div className="relative z1">{children}</div>
        <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
      </div>
    </a>
  );
}

Link.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
};

function filter({ plugins }, props) {
  const { page, params, query } = props;
  const href = plugins.router.serializeLocationData(page, { params, query });
  return {
    href,
    onClick(evt) {
      evt.preventDefault();
      plugins.router.assignLocation(href);
    },
  };
}

export default withConsumer(Link, filter);
