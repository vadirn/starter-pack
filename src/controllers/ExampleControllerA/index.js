import React from 'react';
import { withConsumer } from 'main';
import styles from './styles.css';

function filter({ plugins }) {
  const router = plugins.router;
  const href = router.serializeLocationData('example2');
  return {
    onClick: evt => {
      evt.preventDefault();
      // console.log({ context });
      // window.history.pushState(null, null, '/2');
      router.assignLocation(href);
    },
    href,
  };
}

function LinkBody(props) {
  return (
    <a href={props.href} onClick={props.onClick}>
      Hello!
    </a>
  );
}

const Link = withConsumer(LinkBody, filter);

class View extends React.Component {
  render() {
    return (
      <div>
        <div>Hello world from ExampleControllerA</div>
        <div>
          <Link />
        </div>
      </div>
    );
  }
}

export default class ExampleControllerA {
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
