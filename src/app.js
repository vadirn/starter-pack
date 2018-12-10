import { AppContext } from 'context';
import log from 'pretty-log';
import PropTypes from 'prop-types';
import React from 'react';
import controllerModules from './controllers';
import serviceModules from './services';
import { StateMutationAbortError } from 'utils/errors';

// can put validation here
function ensureValidAppState() {}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const { initialServices = {}, initialController = null } = props;
    this.state = {
      appState: {},
      controller: initialController,
      _controllerKey: 0,
    };

    this._services = initialServices;

    this.getServiceInstance = this.getServiceInstance.bind(this);
    this.importService = this.importService.bind(this);
    this.mountController = this.mountController.bind(this);
    this.setAppState = this.setAppState.bind(this);
  }
  getServiceInstance(serviceName) {
    return this._services[serviceName];
  }
  async importService(serviceName, ...args) {
    if (this._services[serviceName]) {
      return Promise.resolve(this._services[serviceName]);
    } else {
      try {
        const module = await serviceModules[serviceName]();
        const Service = module.default;
        this._services[serviceName] = new Service(...args);
        return Promise.resolve(this._services[serviceName]);
      } catch (err) {
        log(err, '❌ Error');
        return Promise.reject(err);
      }
    }
  }
  async mountController(controllerName, defaultPageState = {}) {
    try {
      const module = await controllerModules[controllerName]();
      const Controller = module.default;
      const controller = new Controller({
        importService: this.importService,
        mountController: this.mountController,
        setAppState: this.setAppState,
        getServiceInstance: this.getServiceInstance,
        defaultState: defaultPageState,
      });

      this.setState(state => {
        if (state.controller) {
          state.controller.dispose();
        }
        state.controller = controller;
        state._controllerKey += 1;
        return state;
      });
    } catch (err) {
      log(err, '❌ Error');
      throw err;
    }
  }
  setAppState(
    mutateAppState = () => {
      throw new StateMutationAbortError();
    }
  ) {
    this.setState(state => {
      try {
        mutateAppState(state.appState); // doesn't return anything, but mutates the state variable
        ensureValidAppState(state.appState); // makes sure that app state isn't messed up
        return state;
      } catch (err) {
        if (err.name !== 'StateMutationAbortError') {
          log(err, '❌ Error mutating state');
        }
        return null;
      }
    });
  }
  render() {
    const { children } = this.props;
    const contextValue = {
      ...this.state,
      importService: this.importService,
      mountController: this.mountController,
      setAppState: this.setAppState,
      getServiceInstance: this.getServiceInstance,
    };
    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
  }
}

App.propTypes = {
  children: PropTypes.node,
  initialServices: PropTypes.object,
  initialController: PropTypes.any,
};
