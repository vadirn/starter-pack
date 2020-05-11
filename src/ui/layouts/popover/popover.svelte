<script>
  import {
    getEventualPlacementProps,
    computeArrowRect,
  } from './popover-placement';
  import { onMount } from 'svelte';
  import Portal from 'ui/layouts/portal.svelte';
  import { levelStack } from 'session/level-stack';
  import { round } from 'math-helpers/round';

  let className = '';
  export { className as class };
  export let style = '';

  export let anchorRect;
  export let arrowAnchorRect = anchorRect;
  export let placement = 'top';
  export let offset = 0;
  export let ignoreLevelStack = false;

  export let eventualPlacement;
  export let popoverRect;
  export let arrowRect;
  export let level = levelStack.add({ ignore: ignoreLevelStack });

  let popoverWidth = 0;
  let popoverHeight = 0;
  let popover;

  $: popoverDimensions = { width: popoverWidth, height: popoverHeight };
  $: placementProps = getEventualPlacementProps(
    placement,
    $anchorRect,
    popoverDimensions,
    offset
  );
  $: eventualPlacement = placementProps.eventualPlacement;
  $: popoverRect = placementProps.rect;
  $: arrowRect = computeArrowRect(popoverRect, $arrowAnchorRect);
  $: translate3d = `translate3d(${round(popoverRect?.x ?? 0)}px, ${round(
    popoverRect?.y ?? 0
  )}px, 0)`;

  onMount(() => {
    popoverWidth = popover.offsetWidth;
    popoverHeight = popover.offsetHeight;

    return () => {
      levelStack.remove(level.cid);
    };
  });
</script>

<Portal
  class="fixed top-0 left-0 {className}"
  style="transform: {translate3d}; z-index: {level.z}; {style}">
  <div
    bind:this={popover}
    bind:offsetWidth={popoverWidth}
    bind:offsetHeight={popoverHeight}>
    <slot />
  </div>
</Portal>
