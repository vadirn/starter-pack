import PlaygroundView from 'views/Playground';

function toggleGrid({ setState, plugins, page }, checked) {
  let grid = 'off';
  if (checked) {
    grid = 'on';
  }
  plugins.router.replaceLocation(
    plugins.router.serializeLocationData(page.name, { params: page.params, query: Object.assign(page.query, { grid }) })
  );
  setState(data => {
    data.displayGrid = checked;
    return data;
  });
}

export default class Playground {
  get View() {
    return PlaygroundView;
  }
  get actions() {
    return {
      toggleGrid,
    };
  }
  dispose() {}
}
