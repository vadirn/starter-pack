export class HTTPError extends Error {
  constructor(response) {
    super(response.statusText);
    this.name = 'HTTPError';
    this.response = response;
  }
}

export class HTTPAbortError extends Error {
  constructor() {
    super();
    this.name = 'AbortError';
  }
}

export class HTTPTimeoutError extends Error {
  constructor() {
    super();
    this.name = 'TimeoutError';
  }
}
