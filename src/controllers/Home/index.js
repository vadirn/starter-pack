import { meta } from 'assets/meta';
import { HomeView } from 'views/Home';

export default class {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  get meta() {
    return {
      title: `Home - ${meta.title}`,
    };
  }
  get View() {
    return HomeView;
  }
  dispose() {}
}
