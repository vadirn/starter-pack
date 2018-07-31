import 'assets/css/global.css';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Router from 'router';
import controllers from 'controllers';
import services from 'services';
import { Session } from 'session';
import getInstance from 'get-instance';

if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const session = getInstance('session', Session, {
  container: document.getElementById('mount-point'),
  controllers,
});

class RouterComponent extends React.Component {
  async componentDidMount() {
    const { plugins, mountController } = this.props;
    plugins.router.push(
      {
        name: 'example1',
        pattern: '/',
        handler() {
          mountController('ExampleControllerA');
        },
      },
      {
        name: 'example2',
        pattern: '/2',
        handler() {
          mountController('ExampleControllerB');
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

ReactDOM.render(
  <App modules={{ controllers, services }} plugins={{ router }} />,
  document.getElementById('mount-point')
);

export const withConsumer = session.withConsumer;
