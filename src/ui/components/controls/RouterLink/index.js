import { Link } from 'components/controls/Link';
import { AppContext } from 'context';
import PropTypes from 'prop-types';
import React, { useCallback, useContext } from 'react';

export function RouterLink(props = {}) {
  const { page, params, query, children, ...restProps } = props;
  const { getServiceInstance } = useContext(AppContext);
  const router = getServiceInstance('router');
  const href = router.serializeLocationData(page, { params, query });
  const onClick = useCallback(
    evt => {
      if (evt.target.getAttribute('target') !== '_blank' && evt.button === 0 && !evt.metaKey) {
        evt.preventDefault();
        router.assignLocation(href);
      }
    },
    [href]
  );
  return (
    <Link href={href} onClick={onClick} {...restProps}>
      {children}
    </Link>
  );
}

RouterLink.propTypes = {
  page: PropTypes.string,
  params: PropTypes.object,
  query: PropTypes.object,
  children: PropTypes.node,
};
