import React from 'react';
import c from 'classnames';
import s from './styles.css';
import Link from 'components/Link';
import components from './components';
import PropTypes from 'prop-types';
import withConsumer from 'with-consumer';

function Playground({ component }) {
  const Component = components[component] || (() => 'Please select a component');
  return (
    <div className={s.container}>
      <div className={s.heading}>
        <h1>PLAYGROUND</h1>
      </div>
      <div>
        <ul>
          {components.order.map(name => {
            return (
              <li key={name} className={c('m-u-b', { bold: component === name })}>
                <Link page="playground-component" params={{ component: name }}>
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={s.grid}>
        <Component />
      </div>
    </div>
  );
}

Playground.propTypes = {
  component: PropTypes.string,
};

function filter({ controller }) {
  return { component: controller._component };
}

export default withConsumer(Playground, filter);
