import PlaygroundView from 'views/Playground';

export default class Playground {
  constructor(context, params) {
    this._component = params && params.component;
  }
  get View() {
    return PlaygroundView;
  }
  get actions() {
    return {};
  }
  dispose() {}
}
