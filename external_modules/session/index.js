import React from 'react';
import ReactDOM from 'react-dom';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.mountController = this.mountController.bind(this);
    this.importService = this.importService.bind(this);

    props.router.helpers = { mountController: this.mountController };

    this.state = {
      _mountIndex: 0,
      _controller: null,
      data: {
        foo: 'bar',
      },
    };
    this._services = {};
  }

  // Returns context to be used in actions, controllers and services
  contextualize(state) {
    const { data, _controller } = state;
    const { router } = this.props;
    return {
      data,
      router,
      controller: _controller,
      actions: _controller ? _controller.actions : {},
      mountController: this.mountController,
      importService: this.importService.bind(this),
    };
  }

  // Imports controller and tries to mount it
  async mountController(controllerName, ...constructorArgs) {
    const initialMountIndex = this.state.mountIndex;
    const importModule = this.props.controllers[controllerName];
    try {
      const module = await importModule();
      const Controller = module.default;
      // setState might be async, so only mount in case mountIndex remains the same
      this.setState(state => {
        if (initialMountIndex === state.mountIndex) {
          // Note: this.contextualize(state) will return previous { controller }
          return { _controller: new Controller(this.contextualize(state), ...constructorArgs) };
        }
        return null;
      });
    } catch (err) {
      // FIXME: rethrow for now
      throw err;
    }
  }

  // Returns a promise that returns a service instance
  async importService(serviceName, ...constructorArgs) {
    if (this._services[serviceName]) {
      return this._services[serviceName];
    }
    const importModule = this.props.services[serviceName];
    this._services[serviceName] = new Promise((resolve, reject) => {
      try {
        const module = importModule();
        const Service = module.default;
        resolve(new Service(this.contextualize(this.state), ...constructorArgs));
      } catch (err) {
        reject(err);
      }
    });
    return this._services[serviceName];
  }

  componentDidMount() {
    // router should be launched here (it decides what controllers to mount)
    this.props.router.handleLocationChange(window.location);
  }

  render() {
    return (
      <this.props.context.Provider value={this.contextualize(this.state)}>
        {this.state._controller ? <this.state._controller.View /> : null}
      </this.props.context.Provider>
    );
  }
}

export function filterProps(props) {
  return React.Children.map(children, child => React.cloneElement(child, iteratee(props)));
}

export class Session {
  constructor({ container, controllers = {}, services = {}, router }) {
    this._container = container;
    this._controllers = controllers;
    this._services = services;
    this._router = router;
    this._context = React.createContext();

    this.withDeps = this.withDeps.bind(this);
  }
  // a component that is going to provide data to child components
  withDeps(Component, filter) {
    const self = this;
    return class WithDeps extends React.Component {
      constructor(props) {
        super(props);
        this.passContext = this.passContext.bind(this);
      }
      passContext(value) {
        return <Component {...Object.assign(filter(value), this.props)} />;
      }
      render() {
        return <self._context.Consumer>{this.passContext}</self._context.Consumer>;
      }
    };
  }
  start() {
    ReactDOM.render(
      <App context={this._context} controllers={this._controllers} services={this._services} router={this._router} />,
      this._container
    );
  }
}
