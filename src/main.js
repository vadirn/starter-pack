/* global APP_VERSION */
import 'assets/css/global.css';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Router from 'router';
import FocusObserver from 'focus-observer';
import controllers from 'controllers';
import services from 'services';
import { Session } from 'session';
import getInstance from 'get-instance';
import log from 'pretty-log';

if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

log(`Good luck, have fun
build v${APP_VERSION}`);

const session = getInstance('session', Session, {
  container: document.getElementById('mount-point'),
  controllers,
});

class RouterComponent extends React.Component {
  async componentDidMount() {
    const { plugins, mountController } = this.props;
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
          mountController('Playground', params);
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

    plugins.router.handleLocationChange(window.location);
  }
  render() {
    if (this.props.controller) {
      return <this.props.controller.View />;
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
};

const App = session.withProvider(
  session.withConsumer(RouterComponent, ({ plugins, controller, mountController }) => ({
    plugins,
    controller,
    mountController,
  }))
);

const router = getInstance('router', Router);
const focusObserver = getInstance('focus-observer', FocusObserver);

ReactDOM.render(
  <App modules={{ controllers, services }} plugins={{ router, focusObserver }} />,
  document.getElementById('mount-point')
);

export default session.withConsumer;
