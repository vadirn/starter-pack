function fetchWrapper(method = 'GET', url, _options = {}) {
  const abortController = new window.AbortController();
  const signal = abortController.signal;
  const options = Object.assign({ headers: {} }, _options);

  const fetchOptions = {
    headers: new window.Headers({
      // add default headers here
      'content-type': 'application/json',
      ...options.headers,
    }),
    body: options.body,
    method,
    cache: 'no-cache',
    credentials: 'same-origin',
    signal,
  };

  const response = window.fetch(fetchOptions);
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
