import React from 'react';
import PropTypes from 'prop-types';

export class Session {
  constructor() {
    this._context = React.createContext();

    this.withConsumer = this.withConsumer.bind(this);
    this.withContext = this.withProvider.bind(this);
  }
  // HOC, provides filtered data to a Component
  withConsumer(Component, filter) {
    const self = this;
    return class WithConsumer extends React.Component {
      constructor(props) {
        super(props);
        this.passContext = this.passContext.bind(this);
      }
      passContext(value) {
        return <Component {...Object.assign(filter(value, this.props), this.props)} />;
      }
      render() {
        return <self._context.Consumer>{this.passContext}</self._context.Consumer>;
      }
    };
  }
  withProvider(Component) {
    const self = this;
    class WithProvider extends React.Component {
      constructor(props) {
        super(props);
        this.contextualize = this.contextualize.bind(this);
        this.mountController = this.mountController.bind(this);
        this.importService = this.importService.bind(this);
        this._setState = this._setState.bind(this);

        // service instances are stored here
        this._services = {};

        this.state = {
          _mountIndex: 0,
          controller: null,
          data: {},
          setState: this._setState,
        };
      }
      contextualize(state) {
        return {
          data: state.data,
          controller: state.controller,
          plugins: this.props.plugins,
          setState: this._setState,
          mountController: this.mountController,
          importService: this.importService,
        };
      }
      _setState(producer, model) {
        if (typeof producer !== 'function') {
          throw new Error('State producer should be a function');
        }
        this.setState(state => {
          const data = JSON.parse(JSON.stringify(state.data));
          if (model) {
            try {
              // Apply model to original data, in case producer will mutate data
              return { data: model.applyTo(producer(data), state.data) };
            } catch (err) {
              console.error('State was not modified. Error while applying model: ', err);
              return null;
            }
          } else {
            return { data: producer(data) };
          }
        });
      }
      async mountController(name, ...args) {
        const mountIdxAtStart = this.state._mountIndex;
        const importModule = this.props.modules.controllers[name];
        try {
          const module = await importModule();
          const Controller = module.default;
          // setState might be async, so only mount in case mountIndex remains the same
          this.setState(state => {
            if (mountIdxAtStart === state._mountIndex) {
              // Note: this.contextualize(state) will contain previous controller
              if (state.controller) {
                state.controller.dispose();
              }
              return { controller: new Controller(this.contextualize(state), ...args) };
            }
            return null;
          });
        } catch (err) {
          // FIXME: rethrow for now
          throw err;
        }
      }
      async importService(name, ...args) {
        if (this._services[name]) {
          return this._services[name];
        }
        const importModule = this.props.modules.services[name];
        this._services[name] = importModule().then(module => {
          const Service = module.default;
          return new Service(...args);
        });
        return this._services[name];
      }
      render() {
        return (
          <self._context.Provider value={this.contextualize(this.state)}>
            <Component {...this.props} />
          </self._context.Provider>
        );
      }
    }
    WithProvider.propTypes = {
      context: PropTypes.shape({
        Provider: PropTypes.any,
        Consumer: PropTypes.any,
      }),
      children: PropTypes.node,
      modules: PropTypes.shape({
        controllers: PropTypes.objectOf(PropTypes.func).isRequired,
        services: PropTypes.objectOf(PropTypes.func).isRequired,
      }),
      plugins: PropTypes.object,
    };
    return WithProvider;
  }
}
