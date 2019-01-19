import PlaygroundView from 'views/Playground';

export default class Playground {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  get meta() {
    return {};
  }
  get View() {
    return PlaygroundView;
  }
  dispose() {}
}
