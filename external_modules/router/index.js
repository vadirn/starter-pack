import createHistory from 'history/createBrowserHistory';

export default class Router {
  constructor(routes = [], helpers = {}) {
    this._helpers = helpers;
    this._routes = routes;
    this._history = createHistory();
    this._history.listen((location, action) => {
      this.handleLocationChange(location, action);
    });
  }
  set helpers(helpers) {
    this._helpers = helpers;
  }
  handleLocationChange(location, action) {
    // match location.pathname with route
    // call corresponding action
    // pass parsed location and action
    const route = findRoute(location, this._routes);
    if (route) {
      route.handler(this._helpers, route, action);
    } else {
      throw new Error('404');
    }
  }
}

export function findRoute(location, routes) {
  for (const route of routes) {
    const locationData = decomposeLocation(location, route.pattern);
    if (locationData !== undefined) {
      return { ...route, data: locationData };
    }
  }
  return undefined;
}

// Returns an object, representing querystring
export function decomposeQuery(querystring) {
  return querystring
    .slice(1)
    .split('&')
    .reduce((result, item) => {
      const queryItem = item.split('=');
      const nextResult = result;
      const key = decodeURIComponent(queryItem[0]);
      const value = queryItem[1] ? decodeURIComponent(queryItem[1]) : null;
      if (key.length > 0) {
        nextResult[key] = value || key;
      }
      return nextResult;
    }, {});
}

// Create a querystring from an object representation
export function composeQuery(query) {
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
export function splitPathname(pathname) {
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
export function decomposeLocation({ pathname, search }, route) {
  const routeComponents = splitPathname(route);
  const pathnameComponents = splitPathname(pathname);
  const query = decomposeQuery(search);
  if (routeComponents.length !== pathnameComponents.length) {
    return undefined;
  }
  let accum = { params: {}, query };
  for (const [routeComponentIdx, routeComponent] of routeComponents.entries()) {
    if (routeComponent[0] === ':') {
      accum.params[routeComponent.slice(1)] = pathnameComponents[routeComponentIdx];
    } else if (routeComponent !== pathnameComponents[routeComponentIdx]) {
      return undefined;
    }
  }
  return accum;
}

// Composes a url from provided route pattern, params and query objects
export function composeURL(route, { params = {}, query = {} } = {}) {
  const routeComponents = splitPathname(route);
  let url = '';
  for (const routeComponent of routeComponents) {
    if (routeComponent[0] === ':') {
      url += `/${params[routeComponent.slice(1)]}`;
    } else {
      url += `/${routeComponent}`;
    }
  }
  url += composeQuery(query);
  return url;
}
