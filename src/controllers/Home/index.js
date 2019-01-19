import View from 'views/Home';

export default class {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  get meta() {
    return {};
  }
  get View() {
    return View;
  }
  dispose() {}
}
