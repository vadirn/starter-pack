import { HTTPTimeoutError, HTTPAbortError } from './utils';

function xhrWrapper(method, url, _options = {}) {
  const xhrOptions = Object.assign({ headers: {} }, _options);
  const xhr = new XMLHttpRequest();
  const xhrPromise = new Promise((resolve, reject) => {
    xhr.onload = () => {
      resolve(xhr);
    };
    xhr.onabort = () => {
      reject(new HTTPAbortError());
    };
    xhr.onerror = () => {
      reject();
    };
    xhr.ontimeout = () => {
      reject(new HTTPTimeoutError());
    };
    xhr.open(method, url);
    // Set headers
    for (const header of Object.keys(xhrOptions.headers)) {
      xhr.setRequestHeader(header, xhrOptions.headers[header]);
    }
    xhr.send(xhrOptions.body);
  });
  xhrPromise.abort = xhr.abort;
  return xhrPromise;
}

export function get(url, options) {
  return xhrWrapper('GET', url, options);
}

export function post(url, options) {
  return xhrWrapper('POST', url, options);
}
