<script>
  import { nil } from 'nil';

  let className = '';
  export { className as class };
  export let style = '';
  export let size = 6;

  export let placement;
  export let placementRect;

  function getStyle(placement, placementRect) {
    if ([placement, placementRect].some(nil)) return 'display: none;';
    const p = placement.split('-')[0];
    if (p === 'top' || p === 'bottom') {
      return `transform: translateX(${placementRect.left -
        size}px); ${p}: 100%; left: 0; border-${p}-color: currentColor;`;
    } else {
      return `transform: translateY(${placementRect.top -
        size}px); ${p}: 100%; top: 0; border-${p}-color: currentColor;`;
    }
  }

  $: s = getStyle(placement, placementRect);
</script>

<div
  class="absolute {className}"
  style="width: 0; height: 0; border-width: {size}px; border-color: transparent;
  {s}
  {style}" />
