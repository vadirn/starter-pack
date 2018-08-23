import ControlsAndStates from './controls-and-states';
import VariationsAndSpacing from './text-variations-and-spacing';
import Colors from './colors';
import Form from './controls-form';
import Toolbar from './layouts-toolbar';

export default [
  {
    key: 'colors',
    label: 'Colors',
    items: [{ key: 'colors', label: 'Colors', component: Colors }],
  },
  {
    key: 'layouts',
    label: 'Layouts',
    items: [{ key: 'toolbar', label: 'Toolbar', component: Toolbar }],
  },
  {
    key: 'text',
    label: 'Text',
    items: [{ key: 'variations-and-spacing', label: 'Variations and spacing', component: VariationsAndSpacing }],
  },
  {
    key: 'controls',
    label: 'Controls',
    items: [
      {
        key: 'controls-states',
        label: 'Controls and states',
        component: ControlsAndStates,
      },
      { key: 'form', label: 'Form', component: Form },
    ],
  },
  {
    key: 'compound-elements',
    label: 'Compound elements',
    items: [],
  },
];
