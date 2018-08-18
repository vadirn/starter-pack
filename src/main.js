/* global APP_VERSION, IS_BROWSER */
import 'assets/css/global.css';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Router from 'router';
import FocusObserver from 'focus-observer';
import _controllers from 'controllers';
import _services from 'services';
import { Session } from 'session';
import getInstance from 'get-instance';
import log from 'pretty-log';

log(`Good luck, have fun
build v${APP_VERSION}`);

const session = getInstance('session', Session);

if (IS_BROWSER && window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export class RouterComponent extends React.Component {
  constructor(props) {
    super(props);
    const { plugins, mountController } = props;

    this._usePrerenderedComponent = IS_BROWSER;

    plugins.router.push(
      {
        name: 'playground',
        pattern: '/playground',
        handler() {
          mountController('Playground');
        },
      },
      {
        name: 'playground-component',
        pattern: '/playground/:component',
        handler({ params }) {
          mountController('Playground', data => {
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
      }
    );
  }
  componentDidMount() {
    if (IS_BROWSER) {
      const { plugins } = this.props;
      plugins.router.handleLocationChange(window.location);
      this.props.prerenderedHTML.clear();
    }
  }
  // TODO: waiting for React suspense
  render() {
    if (this.props.controller) {
      return <this.props.controller.View />;
    } else if (this._usePrerenderedComponent) {
      return this.props.prerenderedHTML.value;
    }
    return null;
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
