import React from 'react';

class View extends React.Component {
  render() {
    return <div>Hello world from ExampleControllerB</div>;
  }
}

export default class ExampleControllerB {
  get View() {
    return View;
  }
  get actions() {
    return {};
  }
  dispose() {
    console.log('ExampleControllerB is going to be disposed');
  }
}
