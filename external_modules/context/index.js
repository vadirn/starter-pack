import React from 'react';

export const AppContext = React.createContext();
export const PageContext = React.createContext();

// HOC for the consumer
function createContextConsumer(Context) {
  return function ContextConsumer(Component, filter) {
    return class Consumer extends React.Component {
      constructor(props) {
        super(props);
        this.passContext = this.passContext.bind(this);
      }
      passContext(value) {
        return <Component {...Object.assign(filter(value, this.props), this.props)} />;
      }
      render() {
        return <Context.Consumer>{this.passContext}</Context.Consumer>;
      }
    };
  };
}

export const AppContextConsumer = createContextConsumer(AppContext);
export const PageContextConsumer = createContextConsumer(PageContext);
