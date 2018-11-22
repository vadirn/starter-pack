// Global state description
import JSONModel from 'json-model';

export default new JSONModel({
  __type: 'object',
  __value: {
    isLoading: { __type: 'boolean', __value: false },
    page: {
      __type: 'object',
      __value: {
        name: { __type: 'string', __value: '' },
        params: { __type: 'object', __value: { '*': { __type: '*' } } },
        query: { __type: 'object', __value: { '*': { __type: '*' } } },
      },
    },
    Playground: {
      __type: 'object',
      __value: {
        component: { __type: 'string' },
        displayGrid: { __type: 'boolean', __value: false },
      },
    },
  },
});
