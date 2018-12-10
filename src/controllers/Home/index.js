import View from 'views/Home';

export default class {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  get View() {
    return View;
  }
  dispose() {}
}
