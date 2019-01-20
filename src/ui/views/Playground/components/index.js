import { Colors } from './colors';
import { ControlsAndStates } from './controls-and-states';
import { PlaygroundForm } from './controls-form';
import { FormHooks } from './controls-form-hooks';
import { LayoutsToolbar } from './layouts-toolbar';
import { VariationsAndSpacing } from './text-variations-and-spacing';

export const components = [
  {
    key: 'colors',
    label: 'Colors',
    items: [{ key: 'colors', label: 'Colors', component: Colors }],
  },
  {
    key: 'layouts',
    label: 'Layouts',
    items: [{ key: 'toolbar', label: 'Toolbar', component: LayoutsToolbar }],
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
      { key: 'form', label: 'Form', component: PlaygroundForm },
      { key: 'form-hooks', label: 'Form With Hooks', component: FormHooks },
    ],
  },
  {
    key: 'compound-elements',
    label: 'Compound elements',
    items: [],
  },
];
