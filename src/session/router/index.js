import { manifest } from '@app/manifest';
import { parsePath } from 'url-helpers/path';
import { parseQuery } from 'url-helpers/query';
import { assert, ParseError, NotFoundError } from 'errors';
import { pipeline } from 'pipeline';
import { observable } from 'observable';
import { monitor } from 'session/process-monitor';
import { expose } from 'dev-helpers';

import NotFound from 'routes/404.svelte';
import BadNetwork from 'routes/_bad-network.svelte';
import {
  history,
  forward,
  redirect,
  forwardOnClick,
  redirectOnClick,
} from './helpers';
import App from './app.svelte';

let app;

window.history.scrollRestoration = 'manual';

function matchRoute(location) {
  const pathname = location.pathname;
  const query = parseQuery(location.search);
  for (const [route, importFn] of manifest) {
    try {
      const props = parsePath(pathname, route);
      return { route, props, query, importFn };
    } catch (err) {
      assert(err instanceof ParseError, err);
    }
  }
  return {};
}

const pageCache = observable(); // passing page object as observable allows to get the latest value via getContext

const historian = pipeline([
  (prev, { location }) => matchRoute(location),
  async ({ importFn, ...page }) => {
    if (importFn) {
      try {
        const Module = await monitor.add(importFn());
        return { page, Module };
      } catch (err) {
        console.log(err);
        return { page, Module: { default: BadNetwork } };
      }
    } else {
      return { page, Module: { default: NotFound } };
    }
  },
  async ({ page, Module }, { scrollState, props }) => {
    let component = Module.default;
    try {
      await monitor.add(Module.preload?.({ page, forward, redirect }));
    } catch (err) {
      if (assert(err instanceof NotFoundError, err)) {
        component = NotFound;
      }
    }
    pageCache.set(page);
    return {
      props,
      scrollState,
      component,
    };
  },
  initialProps => {
    const props = {
      ...initialProps,
      pageCache,
      forwardOnClick,
      redirectOnClick,
      forward,
      redirect,
    };
    if (app) {
      app.$set(props);
    } else {
      app = new App({
        target: document.body,
        props,
      });
    }
  },
]);

history.subscribe(historian);

expose('pageCache', pageCache);
