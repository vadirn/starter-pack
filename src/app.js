import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash.merge';
import controllerModules from './controllers';
import serviceModules from './services';
import supermodel from './supermodel';
import { AppContext } from 'context';
import log from 'pretty-log';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const { initialServices = {}, initialController = null } = props;
    this.state = {
      // this will return default app state
      appState: supermodel.apply({}, {}),
      controller: initialController,
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
  async mountController(controllerName, appStateProducer = () => null) {
    if (typeof appStateProducer !== 'function') {
      throw new Error('State producer should be a function');
    }
    try {
      const module = await controllerModules[controllerName]();
      const Controller = module.default;
      const controller = new Controller({
        importService: this.importService,
        mountController: this.mountController,
        setAppState: this.setAppState,
        getServiceInstance: this.getServiceInstance,
      });

      this.setState(state => {
        if (state.controller) {
          state.controller.dispose();
        }
        const rawPatch = appStateProducer(state.appState);
        if (!rawPatch) {
          return { controller };
        }
        try {
          const patch = supermodel.apply(rawPatch, state.appState);
          // next recursively merge appState and patch
          return { appState: merge(state.appState, patch), controller };
        } catch (err) {
          log(err, '❌ Error applying model');
          return { controller };
        }
      });
    } catch (err) {
      log(err, '❌ Error');
      throw err;
    }
  }
  setAppState(producer) {
    if (typeof producer !== 'function') {
      throw new Error('State producer should be a function');
    }
    this.setState(state => {
      const rawPatch = producer(state.appState);
      if (!rawPatch) {
        return null;
      }
      try {
        const patch = supermodel.apply(rawPatch, state.appState);
        // next recursively merge appState and patch
        return merge(state.appState, patch);
      } catch (err) {
        log(err, '❌ Error applying model');
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
      setState: this.setAppState,
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
