import { observable } from 'observable';

let id = 0;
export const scrollHistory = {};
export const propsHistory = {};

export const history = observable({
  location: window.location,
  scrollState: scrollState(),
  props: {},
});

function scrollState() {
  return {
    x: pageXOffset,
    y: pageYOffset,
  };
}

/**
 * Uses window.history.pushState to navigate to a given page
 * @param {string} path
 * @param {Object} props
 */
export function forward(path, props = {}) {
  scrollHistory[id] = scrollState(); // store current scroll state
  propsHistory[id] = props; // store props

  id += 1; // increment page id
  const url = new URL(path, window.location.origin);
  window.history.pushState({ id }, null, url);
  history.set({
    location: window.location,
    scrollState: { x: 0, y: 0 },
    props,
  });
}

/**
 * Uses window.history.replaceState to redirect to a given page
 * @param {string} path
 * @param {Object} props
 */
export function redirect(path, props = {}) {
  scrollHistory[id] = scrollState();
  propsHistory[id] = props;
  const url = new URL(path, window.location.origin);
  window.history.replaceState({ id }, null, url);
  history.set({
    location: window.location,
    scrollState: { x: 0, y: 0 },
    props,
  });
}

export function forwardOnClick(node) {
  const handleClick = evt => {
    const href = evt.currentTarget.href;
    const target = evt.currentTarget.getAttribute('target');
    if (href && target !== '_blank' && evt.button === 0 && !evt.metaKey) {
      evt.preventDefault();
      forward(href);
    }
  };

  node.addEventListener('click', handleClick);
  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}

export function redirectOnClick(node) {
  const handleClick = evt => {
    const href = evt.currentTarget.href;
    const target = evt.currentTarget.getAttribute('target');
    if (href && target !== '_blank' && evt.button === 0 && !evt.metaKey) {
      evt.preventDefault();
      redirect(href);
    }
  };

  node.addEventListener('click', handleClick);
  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}

window.addEventListener('popstate', evt => {
  history.set({
    location: window.location,
    scrollState: scrollState[evt.state?.id] ?? { x: 0, y: 0 },
    props: propsHistory[evt.state?.id] ?? {},
  });
});
