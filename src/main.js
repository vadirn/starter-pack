/* global APP_VERSION */
import 'assets/css/global.css';
// import 'assets/icons/favicon.ico';
// import 'assets/icons/favicon.svg';
import { AppContext } from 'context';
import FocusObserver from 'focus-observer';
import getInstance from 'get-instance';
import log from 'pretty-log';
import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Router from 'router';
import App from './app';

log(`Good luck, have fun ✌️\nv${APP_VERSION}`);

export function Controller(props = {}) {
  const { prerenderedContent } = props;
  const { getServiceInstance, controller, _controllerKey, mountController } = useContext(AppContext);

  useEffect(() => {
    const router = getServiceInstance('router');
    router.push(
      {
        name: 'playground',
        pattern: '/playground',
        handler() {
          mountController('Playground');
        },
      },
      {
        name: 'playground-component',
        pattern: '/playground/:component',
        handler() {
          mountController('Playground');
        },
      },
      {
        name: '404',
        pattern: '/404',
        handler(url) {
          log(new Error(`No handler for "${url}"`), '❌ Error');
        },
      },
      {
        name: 'home',
        pattern: '/',
        handler() {
          mountController('Home');
        },
      }
    );
    router.callHandler(window.location);
    if (prerenderedContent && prerenderedContent.value) {
      prerenderedContent.clear();
    }
  }, []);

  if (controller) {
    return <controller.View key={_controllerKey} />;
  }

  return prerenderedContent.value || null;
}

// a component, that allows to clear its rendered value, kind of a workaround for mutable render props
class Clearable {
  constructor(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
  clear() {
    this._value = null;
  }
}

if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

getInstance('focus-observer', FocusObserver);
const mountPoint = document.getElementById('mount-point');
// prerendered content helps to avoid a flash of no content
// when the page is loaded the first time
const prerenderedContent = new Clearable(
  <div dangerouslySetInnerHTML={{ __html: mountPoint.cloneNode(true).innerHTML }} />
);

ReactDOM.render(
  <App initialServices={{ router: new Router() }}>
    <Controller prerenderedContent={prerenderedContent} />
  </App>,
  mountPoint
);
