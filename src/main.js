import 'assets/css/global.css';
import 'babel-polyfill';
import controllers from 'controllers';
import Router from 'router';
import services from 'services';
import { Session } from 'session';

if (global.history && 'scrollRestoration' in global.history) {
  global.history.scrollRestoration = 'manual';
}

function getInstance(instanceId, Klass, ...constructorArgs) {
  if (!global[instanceId]) {
    global[instanceId] = new Klass(...constructorArgs);
  }
  return global[instanceId];
}

const session = getInstance('session', Session, {
  container: document.getElementById('mount-point'),
  controllers,
  services,
  router: new Router([
    {
      name: 'example1',
      pattern: '/',
      handler: ({ mountController }) => {
        mountController('ExampleControllerA');
      },
    },
    {
      name: 'example2',
      pattern: '/2',
      handler: ({ mountController }) => {
        mountController('ExampleControllerB');
      },
    },
  ]),
});

export const withDeps = session.withDeps;

session.start();
