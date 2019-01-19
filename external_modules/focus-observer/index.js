const TAB = 9;

export default class FocusObserver {
  constructor(className = 'with-focus-ring') {
    this.className = className;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  }
  onKeyDown(evt, force = false) {
    if (evt.keyCode === TAB || force) {
      document.body.classList.add(this.className);

      window.removeEventListener('keydown', this.onKeyDown);
      window.addEventListener('mousedown', this.onMouseDown);
    }
  }
  onMouseDown() {
    document.body.classList.remove(this.className);

    window.removeEventListener('mousedown', this.onMouseDown);
    window.addEventListener('keydown', this.onKeyDown);
  }
  enableFocusRing() {
    this.onKeyDown({}, true);
  }
}
