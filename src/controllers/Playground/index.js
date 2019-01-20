import { meta } from 'assets/meta';
import { PlaygroundView } from 'views/Playground';

export default class {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  get meta() {
    return {
      title: `Playground - ${meta.title}`,
    };
  }
  get View() {
    return PlaygroundView;
  }
  dispose() {}
}
