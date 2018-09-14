import Link from 'components/controls/Link';
import { withConsumer } from 'main';

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
