/* global IS_SERVER */
import React, { Fragment } from 'react';
import c from 'classnames';
import s from './styles.css';
import RouterLink from 'components/controls/RouterLink';
import components from './components';
import PropTypes from 'prop-types';
import SwitchButton from 'components/controls/SwitchButton';
import Toolbar from 'components/layouts/Toolbar';
import { withConsumer } from 'main';

function Navigation({ components, component, page }) {
  if (IS_SERVER) {
    return (
      <Fragment>
        {components.map(group => {
          return (
            <Fragment key={group.key}>
              <div className="text-caps text-medium color-neutral-4">{group.label}</div>
              <div className="h-m bg-neutral-1 m-s-b" />
            </Fragment>
          );
        })}
      </Fragment>
    );
  }
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
                      page="playground-component"
                      params={{ component: item.key }}
                      query={page.query}>
                      <span className={c({ 'text-bold': item.key === component })}>{item.label}</span>
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

Navigation.propTypes = {
  components: PropTypes.array,
  component: PropTypes.string,
  page: PropTypes.object,
};

class Playground extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (prevProps.component !== this.props.component) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    const { component, displayGrid, toggleGrid, page } = this.props;
    let item;
    for (const group of components) {
      for (const _item of group.items) {
        if (_item.key === component) {
          item = _item;
        }
      }
    }

    let Component = () => 'Please select a component to display';
    if (IS_SERVER) {
      Component = () => null;
    }
    if (item) {
      Component = item.component;
    }

    return (
      <div className={s.container}>
        <Toolbar
          className={c(s.heading, 'p-u p-s-l p-s-r')}
          middle={<h1 className="text-heading text-light">Playground</h1>}
          right={<SwitchButton checked={!!displayGrid} onChange={toggleGrid} left="Grid" />}
        />
        <div className="p-s-l">
          <Navigation page={page} components={components} component={component} />
        </div>
        <div className="relative p-s-r">
          <div className={c({ 'bg-grid z999': displayGrid }, 'absolute', s.grid)} />
          <div className="relative">
            <Component />
          </div>
        </div>
      </div>
    );
  }
}

Playground.propTypes = {
  component: PropTypes.string,
  displayGrid: PropTypes.bool,
  toggleGrid: PropTypes.func,
  page: PropTypes.object,
};

function filter({ data, controller, plugins, setState }) {
  return {
    page: data.page,
    component: data.component,
    displayGrid: data.displayGrid,
    toggleGrid(evt) {
      const { checked } = evt.target;
      controller.actions.toggleGrid({ setState, plugins, page: data.page }, checked);
    },
  };
}

export default withConsumer(Playground, filter);
