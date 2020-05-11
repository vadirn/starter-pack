import { nil } from 'nil';

export const cards = new Map();

export function addCard(key, value) {
  if (nil(key)) return;
  cards.set(key, value);
}

export function deleteCard(key) {
  if (nil(key)) return;
  cards.delete(key);
}

export function closeAll(opts = {}) {
  const { ignore = [] } = opts;
  cards.forEach((getCard, cid) => {
    if (!ignore.includes(cid)) {
      getCard().closeThis({ duration: 0 }); // hide fast, because it is usually used for submenu items
    }
  });
}

export function isEmpty() {
  return cards.size === 0;
}
