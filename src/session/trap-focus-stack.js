import { expose } from 'dev-helpers';
import { cidIssuer } from 'store-helpers/scaffold-collection';
const get_cid = cidIssuer();
const stack = [];

/**
 * Adds trapFocus function to stack, returns a wrapped trapFocus function, that runs only if it is on top of the stack
 * @param trapFn {function}
 * @returns {function & {cid: number}}
 */
function add(trapFn) {
  const cid = get_cid();
  stack.push(cid);
  const returnValue = (...args) => {
    const { [stack.length - 1]: active } = stack;
    if (cid === active) {
      return trapFn(...args);
    }
  };
  returnValue.cid = cid;
  return returnValue;
}

/**
 * Removes trapFocus function with given cid from the stack
 * @param cid {number}
 */
function remove(cid) {
  const idx = stack.indexOf(cid);
  if (idx !== -1) {
    stack.splice(idx, 1);
  }
}

export const trapFocusStack = {
  stack,
  add,
  remove,
};

expose('trapFocusStack', trapFocusStack);
