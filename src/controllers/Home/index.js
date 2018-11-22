import HomeView from 'views/Home';

export default class Home {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  get View() {
    return HomeView;
  }
  dispose() {}
}
