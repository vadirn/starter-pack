export default class EventTarget {
  constructor() {
    this._eventListeners = new Map();
  }
  addEventListener(eventType, callback) {
    if (!this._eventListeners.has(eventType)) {
      this._eventListeners.set(eventType, new Set());
    }
    this._eventListeners.get(eventType).add(callback);
  }
  removeEventListener(eventType, callback) {
    if (this._eventListeners.has(eventType)) {
      this._eventListeners.get(eventType).delete(callback);
    }
  }
  dispatchEvent(event) {
    if (!this._eventListeners.has(event.type)) {
      return;
    }
    const callbacks = Array.from(this._eventListeners.get(event.type));
    for (const callback of callbacks) {
      callback.call(this, event);
    }
  }

  removeAllEventListeners(eventType) {
    if (this._eventListeners.has(eventType)) {
      this._eventListeners.get(eventType).clear();
    }
  }
}
