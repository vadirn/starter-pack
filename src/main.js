/* global APP_VERSION, IS_BROWSER */
import 'assets/css/global.css';
import _controllers from 'controllers';
import FocusObserver from 'focus-observer';
import getInstance from 'get-instance';
import log from 'pretty-log';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'router';
import _services from 'services';
import { Session } from 'session';

log(`Good luck, have fun\nv${APP_VERSION}`);

const session = getInstance('session', Session);

if (IS_BROWSER && window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export class RouterComponent extends React.Component {
  constructor(props) {
    super(props);
    const { plugins, mountController } = props;

    plugins.router.push(
      {
        name: 'playground',
        pattern: '/playground',
        handler({ params, query }) {
          let displayGrid = false;
          if (query.grid === 'on') {
            displayGrid = true;
          }
          mountController('Playground', data => {
            data.displayGrid = displayGrid;
            data.page = { name: 'playground', params, query };
            data.component = '';
            return data;
          });
        },
      },
      {
        name: 'playground-component',
        pattern: '/playground/:component',
        handler({ params, query }) {
          let displayGrid = false;
          if (query.grid === 'on') {
            displayGrid = true;
          }
          mountController('Playground', data => {
            data.displayGrid = displayGrid;
            data.page = { name: 'playground-component', params, query };
            data.component = params.component;
            return data;
          });
        },
      },
      {
        name: '404',
        pattern: '/404',
        handler(url) {
          log(new Error(`No handler for "${url}"`), '❌ Error');
        },
      },
      {
        name: 'home',
        pattern: '/',
        handler() {
          mountController('Home');
        },
      }
    );
  }
  componentDidMount() {
    if (IS_BROWSER) {
      const { plugins } = this.props;
      plugins.router.callHandler(window.location);
      this.props.prerenderedHTML.clear();
    }
  }
  // TODO: waiting for React suspense
  render() {
    if (this.props.controller) {
      return <this.props.controller.View />;
    }
    return this.props.prerenderedHTML.value;
  }
}

RouterComponent.propTypes = {
  mountController: PropTypes.func.isRequired,
  plugins: PropTypes.object,
  controller: PropTypes.shape({
    View: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  }),
  prerenderedHTML: PropTypes.any,
};

export const App = session.withProvider(
  session.withConsumer(RouterComponent, ({ plugins, controller, mountController, prerenderedHTML }) => ({
    prerenderedHTML,
    plugins,
    controller,
    mountController,
  }))
);

export const router = getInstance('router', Router);
export const focusObserver = getInstance('focus-observer', FocusObserver);

class Clearable {
  constructor(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
  clear() {
    this._value = null;
  }
}

if (IS_BROWSER) {
  const mountPoint = document.getElementById('mount-point');
  const prerenderedHTML = new Clearable(
    <div dangerouslySetInnerHTML={{ __html: mountPoint.cloneNode(true).innerHTML }} />
  );
  ReactDOM.render(
    <App
      prerenderedHTML={prerenderedHTML}
      modules={{ controllers: _controllers, services: _services }}
      plugins={{ router, focusObserver }}
    />,
    mountPoint
  );
}

export const withProvider = session.withProvider;
export const withConsumer = session.withConsumer;
export const controllers = _controllers;
export const services = _services;
