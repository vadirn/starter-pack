import textAndSpacing from './text-and-spacing';
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
    items: [{ key: 'text-and-spacing', label: 'Text and spacing', component: textAndSpacing }],
  },
  {
    key: 'controls',
    label: 'Controls',
    items: [{ key: 'form', label: 'Form', component: form }],
  },
  {
    key: 'compound-elements',
    label: 'Compound elements',
    items: [],
  },
];
