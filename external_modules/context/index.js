import React from 'react';

export const AppContext = React.createContext();

// HOC for the consumer
export function Consumer(Component, filter) {
  return class Consumer extends React.Component {
    constructor(props) {
      super(props);
      this.passContext = this.passContext.bind(this);
    }
    passContext(value) {
      return <Component {...Object.assign(filter(value, this.props), this.props)} />;
    }
    render() {
      return <AppContext.Consumer>{this.passContext}</AppContext.Consumer>;
    }
  };
}
