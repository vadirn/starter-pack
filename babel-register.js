const path = require('path');
const { resolve } = require('./scripts/bundler/env');
import { Module } from 'module';

const loadLikeNormal = Module._load;

Module._load = (requireString, _module, isMain) => {
  if (requireString.startsWith('session') || requireString.startsWith('ui')) {
    return loadLikeNormal(resolve('src', requireString), _module, isMain);
  }
  return loadLikeNormal(requireString, _module, isMain);
};

require('@babel/register')({
  ignore: [
    // just like babel-loader test, but inverted
    filepath => {
      // include src/** and node_modules/svelte/**
      // exclude everything else
      const svelte = resolve('node_modules', 'svelte');
      const src = resolve('src');

      const testNested = (parent, child) => {
        const relative = path.relative(parent, child);
        return (
          relative && !relative.startsWith('..') && !path.isAbsolute(relative)
        );
      };

      // return false if not nested
      return !(testNested(src, filepath) || testNested(svelte, filepath));
    },
  ],
});
