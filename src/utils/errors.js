export class StateMutationAbortError extends Error {
  constructor() {
    super();
    this.name = 'StateMutationAbortError';
  }
}
