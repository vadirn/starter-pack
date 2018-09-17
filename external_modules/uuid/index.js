let rng;

let crypto = typeof global !== 'undefined' && (global.crypto || global.msCrypto); // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  let rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function rng() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  let rnds = new Array(16);
  rng = function rng() {
    for (let i = 0, r; i < 16; i += 1) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = (r >>> ((i & 0x03) << 3)) & 0xff;
    }

    return rnds;
  };
}

let byteToHex = [];
for (let i = 0; i < 256; i += 1) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  let i = offset || 0;
  let bth = byteToHex;
  return (
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    '-' +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    '-' +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    '-' +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    '-' +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]] +
    bth[buf[(i += 1)]]
  );
}

export default function uuid(options = {}, buf, offset) {
  let i = (buf && offset) || 0;

  let rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (let ii = 0; ii < 16; ii += 1) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}
