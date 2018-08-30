/* global IS_BROWSER */
import EventTarget from 'event-target';
import getInstance from 'get-instance';

export class History extends EventTarget {
  constructor() {
    super();
    this._handlePopstate = this._handlePopstate.bind(this);
    if (IS_BROWSER) {
      window.addEventListener('popstate', this._handlePopstate);
    }
  }
  _handlePopstate() {
    this.dispatchEvent(new CustomEvent('change', { detail: { url: new URL(window.location.href) } }));
  }
  push(urlString) {
    if (urlString.startsWith('/')) {
      this.dispatchEvent(new CustomEvent('change', { detail: { url: new URL(window.location.origin + urlString) } }));
    } else {
      this.dispatchEvent(new CustomEvent('change', { detail: { url: new URL(urlString) } }));
    }
    if (IS_BROWSER) {
      window.history.pushState(null, null, urlString);
    }
  }
  replace(urlString) {
    if (IS_BROWSER) {
      window.history.replaceState(null, null, urlString);
    }
  }
}

export default class Router {
  constructor(routes = []) {
    this._routes = routes;
    this._history = getInstance('history', History);

    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.serializeLocationData = this.serializeLocationData.bind(this);

    this._history.addEventListener('change', this.handleLocationChange);
  }
  push(...routes) {
    this._routes.push(...routes);
  }
  update(...routes) {
    for (const route of routes) {
      const idx = this._routes.findIndex(_route => (_route.name = route.name));
      if (idx > -1) {
        Object.assign(this._routes[idx], route);
      }
    }
  }
  findRoute(url) {
    return findRoute(url, this._routes);
  }
  handleLocationChange(evt) {
    this.callHandler(evt.detail.url);
  }
  callHandler(url) {
    // match url with route
    // call corresponding action
    // pass parsed location and action
    const route = findRoute(url, this._routes);
    if (route && route.handler) {
      return route.handler.call(null, route.data);
    } else {
      const notFound = findRouteByName('404', this._routes);
      if (notFound) {
        return notFound.handler(url);
      } else {
        throw new Error('404 route handler not found');
      }
    }
  }
  serializeLocationData(routeName, { params, query } = {}) {
    // Find matching route first
    const route = findRouteByName(routeName, this._routes);
    if (!route) {
      return '';
    }
    return serializeLocationData(route.pattern, {
      params,
      query,
    });
  }
  assignLocation(urlString) {
    this._history.push(urlString);
  }
  replaceLocation(urlString) {
    this._history.replace(urlString);
  }
}

export function findRouteByName(routeName, routes) {
  for (const route of routes) {
    if (route.name === routeName) {
      return route;
    }
  }
  return;
}

export function findRoute(location, routes) {
  for (const route of routes) {
    const locationData = parseLocation(location, route.pattern);
    if (locationData !== undefined) {
      return { ...route, data: locationData };
    }
  }
  return;
}

// Returns an object, representing querystring
export function parseQuerystring(querystring) {
  return querystring
    .slice(1)
    .split('&')
    .reduce((result, item) => {
      const queryItem = item.split('=');
      const nextResult = result;
      const key = decodeURIComponent(queryItem[0]);
      let value = null;
      if (queryItem[1]) {
        value = decodeURIComponent(queryItem[1]);
      }
      if (key.length > 0) {
        nextResult[key] = value || key;
      }
      return nextResult;
    }, {});
}

// Create a querystring from an object representation
export function serializeQuery(query) {
  const keys = Object.keys(query);
  if (keys.length === 0) {
    return '';
  }
  return keys
    .reduce((accum, key) => {
      accum += `${key}=${query[key]}&`;
      return accum;
    }, '?')
    .slice(0, -1);
}

// Returns an array of pathname parts
export function parsePathname(pathname) {
  let uri = decodeURIComponent(pathname);
  if (uri[0] === '/') {
    uri = uri.substr(1);
  }
  if (uri[uri.length - 1] === '/') {
    uri = uri.slice(0, -1);
  }
  return uri.split('/');
}

// Returns an object representation of location
// Note: route is a pattern
export function parseLocation({ pathname, search }, route) {
  const routeComponents = parsePathname(route);
  const pathnameComponents = parsePathname(pathname);
  const query = parseQuerystring(search);
  if (routeComponents.length !== pathnameComponents.length) {
    return;
  }
  let accum = { params: {}, query };
  for (const [routeComponentIdx, routeComponent] of routeComponents.entries()) {
    if (routeComponent[0] === ':') {
      accum.params[routeComponent.slice(1)] = pathnameComponents[routeComponentIdx];
    } else if (routeComponent !== pathnameComponents[routeComponentIdx]) {
      return;
    }
  }
  return accum;
}

// Composes a url from provided route pattern, params and query objects
export function serializeLocationData(route, { params = {}, query = {} } = {}) {
  const routeComponents = parsePathname(route);
  let url = '';
  for (const routeComponent of routeComponents) {
    if (routeComponent[0] === ':') {
      url += `/${params[routeComponent.slice(1)]}`;
    } else {
      url += `/${routeComponent}`;
    }
  }
  url += serializeQuery(query);
  return url;
}
