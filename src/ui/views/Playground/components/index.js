import controlsAndStates from './controls-and-states';
import variationsAndSpacing from './variations-and-spacing';
import form from './form';

export default [
  {
    key: 'colors',
    label: 'Colors',
    items: [],
  },
  {
    key: 'layout',
    label: 'Layout',
    items: [],
  },
  {
    key: 'text',
    label: 'Text',
    items: [{ key: 'variations-and-spacing', label: 'Variations and spacing', component: variationsAndSpacing }],
  },
  {
    key: 'controls',
    label: 'Controls',
    items: [
      {
        key: 'controls-states',
        label: 'Controls and states',
        component: controlsAndStates,
      },
      { key: 'form', label: 'Form', component: form },
    ],
  },
  {
    key: 'compound-elements',
    label: 'Compound elements',
    items: [],
  },
];
