/* global APP_VERSION, IS_BROWSER */
import 'assets/css/global.css';
import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import log from 'pretty-log';
import FocusObserver from 'focus-observer';
import getInstance from 'get-instance';
import Router from 'router';
import { AppContext } from 'context';
import controllers from 'controllers';

log(`Good luck, have fun ✌️\nv${APP_VERSION}`);

export function Controller(props = {}) {
  const { prerenderedContent } = props;
  const { getServiceInstance, controller, mountController } = useContext(AppContext);

  useEffect(() => {
    const router = getServiceInstance('router');

    router.push(
      {
        name: 'playground',
        pattern: '/playground',
        handler({ params, query }) {
          let displayGrid = false;
          if (query.grid === 'on') {
            displayGrid = true;
          }
          const page = { name: 'playground', params, query };
          mountController('Playground', () => ({ page, Playground: { displayGrid, component: '' } }));
        },
      },
      {
        name: 'playground-component',
        pattern: '/playground/:component',
        handler({ params, query }) {
          let displayGrid = false;
          if (query.grid === 'on') {
            displayGrid = true;
          }
          const page = { name: 'playground', params, query };
          mountController('Playground', () => ({ page, Playground: { displayGrid, component: params.component } }));
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
        handler({ params, query }) {
          const page = { name: 'home', params, query };
          mountController('Home', () => ({ page }));
        },
      }
    );
    if (IS_BROWSER) {
      router.callHandler(window.location);
    }
    if (prerenderedContent && prerenderedContent.value) {
      prerenderedContent.clear();
    }
  }, []);

  if (controller) {
    return <controller.View />;
  }

  return prerenderedContent.value;
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

if (IS_BROWSER) {
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
}

export default {
  controllers,
  App,
};
