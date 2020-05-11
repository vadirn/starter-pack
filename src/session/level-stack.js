import { cidIssuer } from 'store-helpers/scaffold-collection';
import { expose } from 'dev-helpers';

// issues cid for popup/modal stack management
const get_cid = cidIssuer();

const LEVEL_STEP = 5;
const INITIAL_LEVEL = 500;
const stack = [];
let level = INITIAL_LEVEL;

function add(opts = {}) {
  const { ignore = false } = opts;
  const cid = get_cid();
  if (!ignore) {
    stack.push(cid);
  }
  level += LEVEL_STEP;
  return {
    cid,
    z: level,
  };
}

function remove(cid) {
  const idx = stack.indexOf(cid);
  if (idx !== -1) {
    stack.splice(idx, 1);
  }
  if (stack.length === 0) {
    level = INITIAL_LEVEL;
  }
}

function isNext(cid) {
  const { [stack.length - 1]: active } = stack;
  return active === cid;
}

export const levelStack = {
  stack,
  add,
  remove,
  isNext,
};

expose('levelStack', levelStack);
