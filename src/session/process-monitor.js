import { expose } from 'dev-helpers';
import { observable } from 'observable';
import { nil } from 'nil';

const cache = new Set();
const busy = observable(false);

function add(p) {
  if (nil(p)) {
    return;
  }
  if (cache.has(p)) {
    return p;
  }
  busy.set(true);
  cache.add(p);
  const remove = () => {
    cache.delete(p);
    if (cache.size === 0) {
      busy.set(false);
    }
  };
  p.then(remove, remove);
  return p;
}

export const monitor = {
  add,
  busy,
};

expose('monitor', monitor);
expose('monitorCache', cache);
