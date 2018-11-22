import PlaygroundView from 'views/Playground';

export default class Playground {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  get View() {
    return PlaygroundView;
  }
  toggleGrid(options = {}) {
    const { checked, page } = options;
    let grid = 'off';
    if (checked) {
      grid = 'on';
    }
    const router = this.getServiceInstance('router');
    router.replaceLocation(
      router.serializeLocationData(page.name, {
        params: page.params,
        query: Object.assign(page.query, { grid }),
      })
    );
    this.setAppState(() => ({ Playground: { displayGrid: checked } }));
  }
  dispose() {}
}
