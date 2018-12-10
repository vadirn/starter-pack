function fetchWrapper(method = 'GET', url, _options = {}) {
  const abortController = new window.AbortController();
  const signal = abortController.signal;
  const options = Object.assign({ headers: {} }, _options);

  const fetchOptions = {
    headers: {
      // add default headers here
      'Content-Type': 'application/json; charset=utf-8',
      ...options.headers,
    },
    body: JSON.stringify(options.body),
    method,
    cache: 'no-cache',
    credentials: 'same-origin',
    signal,
  };

  const response = window.fetch(url, fetchOptions);
  response.abort = function abort() {
    abortController.abort();
  };

  return response;
}

export function get(url, options) {
  return fetchWrapper('GET', url, options);
}

export function post(url, options) {
  return fetchWrapper('POST', url, options);
}

export function remove(url, options) {
  return fetchWrapper('DELETE', url, options);
}
