import c from 'classnames';
import RouterLink from 'components/controls/RouterLink';
import SwitchButton from 'components/controls/SwitchButton';
import Toolbar from 'components/layouts/Toolbar';
import { AppContext } from 'context';
import React, { Fragment, useCallback, useContext, useState, useEffect } from 'react';
import components from './components';
import s from './styles.css';

function Sidebar(props = {}) {
  const { components, locationData } = props;
  return (
    <Fragment>
      {components.map(group => {
        return (
          <Fragment key={group.key}>
            <div className="text-caps text-medium color-neutral-4">{group.label}</div>
            <ul className="m-s-b">
              {group.items.map(item => {
                return (
                  <li key={item.key}>
                    <RouterLink
                      className="block"
                      page={'playground-component'}
                      params={{ component: item.key }}
                      query={locationData.query}>
                      <span className={c({ 'text-bold': item.key === locationData.params.component })}>
                        {item.label}
                      </span>
                    </RouterLink>
                  </li>
                );
              })}
            </ul>
          </Fragment>
        );
      })}
    </Fragment>
  );
}

export default function Playground() {
  const { getServiceInstance } = useContext(AppContext);
  const router = getServiceInstance('router');

  const [state, setState] = useState({
    displaySidebar: router.locationData.query.sidebar !== 'off',
    displayGrid: router.locationData.query.grid === 'on',
    componentName: router.locationData.params.component,
  });

  useEffect(
    () => {
      window.scrollTo(0, 0);
    },
    [state.componentName]
  );

  const toggleGrid = useCallback(evt => {
    const { checked } = evt.target;
    // get current locationData
    let grid = 'off';
    if (checked) {
      grid = 'on';
    }
    router.locationData.query.grid = grid;
    router.replaceLocation(
      router.serializeLocationData(router.locationData.name, {
        params: router.locationData.params,
        query: router.locationData.query,
      })
    );
    setState(state => {
      state.displayGrid = grid === 'on';
      return state;
    });
  }, []);

  const toggleSidebar = useCallback(evt => {
    const { checked } = evt.target;
    // get current locationData
    let sidebar = 'on';
    if (!checked) {
      sidebar = 'off';
    }
    router.locationData.query.sidebar = sidebar;
    router.replaceLocation(
      router.serializeLocationData(router.locationData.name, {
        params: router.locationData.params,
        query: router.locationData.query,
      })
    );
    setState(state => {
      state.displaySidebar = sidebar !== 'off';
      return state;
    });
  });

  let item;
  for (const group of components) {
    for (const _item of group.items) {
      if (_item.key === router.locationData.params.component) {
        item = _item;
      }
    }
  }
  let Component = () => 'Please select a component to display';
  if (item) {
    Component = item.component;
  }

  return (
    <div className={c(s.container)}>
      <Toolbar
        className={c(s.heading, 'p-u')}
        left={<SwitchButton checked={state.displaySidebar} onChange={toggleSidebar} right="Sidebar" />}
        middle={<h1 className="text-body-2">Playground</h1>}
        right={<SwitchButton checked={state.displayGrid} onChange={toggleGrid} left="Grid" />}
      />
      <div className={c(s.sidebar, 'p-u', { none: !state.displaySidebar })}>
        <Sidebar locationData={router.locationData} components={components} />
      </div>
      <div className={c(s.content, 'p-u')}>
        <div className={c('bg-grid absolute top-0 left-0 right-0 bottom-0 z999', { none: !state.displayGrid })} />
        <Component />
      </div>
    </div>
  );
}
