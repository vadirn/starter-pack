<script>
  import Popover from 'ui/layouts/popover/popover.svelte';
  import TooltipArrow from './tooltip-arrow.svelte';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  export let tracker;
  export let arrowTracker = tracker;
  export let placement = 'top';
  export let text = '';
  export let offset = 6;
  export let hidden = false;

  export let eventualPlacement = null;
  export let arrowRect = null;

  export let visible = false;
  let timeoutId;

  export function open() {
    if (visible || timeoutId !== undefined) {
      return;
    }
    timeoutId = window.setTimeout(() => {
      tracker.forceUpdate();
      visible = true;
    }, 300);
  }

  export function close() {
    window.clearTimeout(timeoutId);
    timeoutId = undefined;
    visible = false;
  }

  onDestroy(() => {
    window.clearTimeout(timeoutId);
  });
</script>

{#if visible && !hidden}
  <Popover
    class="pointer-events-none"
    {placement}
    {offset}
    anchorRect={tracker.rect}
    arrowAnchorRect={arrowTracker.rect}
    bind:eventualPlacement
    bind:arrowRect>
    <div out:fade={{ duration: 125 }}>
      <slot>
        <div
          class="relative bg-black text-white text-sm leading-4 rounded-sm py-2
          px-3">
          <TooltipArrow
            class="text-black"
            placement={eventualPlacement}
            placementRect={arrowRect} />
          {text}
        </div>
      </slot>
    </div>
  </Popover>
{/if}
