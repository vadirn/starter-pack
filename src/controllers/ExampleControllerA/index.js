import React from 'react';
import { withDeps } from 'main';

function filter(context) {
  console.log(context);
  return {
    onClick: evt => {
      evt.preventDefault();
      context.router._history.push('/2');
    },
    text: context.data.foo,
  };
}

class LinkBody extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.text !== this.props.text;
  }
  render() {
    return (
      <a href="/2" onClick={this.props.onClick}>
        {this.props.text} {this.props.a}
      </a>
    );
  }
}

const Link = withDeps(LinkBody, filter);

class View extends React.Component {
  render() {
    return (
      <div>
        <div>Hello world from ExampleControllerA</div>
        <div>
          <Link a={'a'} />
        </div>
      </div>
    );
  }
}

export default class ExampleControllerA {
  constructor(context) {
    this.context = context;
  }
  get View() {
    return View;
  }
  get actions() {
    return {};
  }
  dispose() {
    console.log('ExampleControllerA is going to be disposed');
  }
}
