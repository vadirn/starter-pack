<script>
  import Popover from 'ui/layouts/popover/popover.svelte';
  import { onDestroy, tick, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { trapFocus } from 'dom-helpers/trap-focus';
  import { trapFocusStack } from 'session/trap-focus-stack';
  import { addCard, cards, deleteCard, closeAll } from './cards-map';
  import { levelStack } from 'session/level-stack';

  const FADE_OUT_DURATION = 125;

  export let closeIgnore = [];
  export let trapFocusIgnoreArrows = false;
  export let ignoreLevelStack = false;

  export let tracker;
  export let arrowTracker = tracker;
  export let placement = 'top';
  export let offset = 0;
  export let hidden = false;

  export let eventualPlacement = null;
  export let arrowRect = null;

  export let visible = false;
  export let level = null;

  let card;
  let trapFocusInstance;
  let previouslyFocused = document.activeElement;
  let fadeOutDuration;

  $: addCard(level?.cid, getCard); // add card to card-map when level.cid changes
  $: hidden && closeThis();

  const ensureFocusVisible = getContext('ensureFocusVisible');

  function handlePointerEvents(evt) {
    // test if evt happened within any of the visible cards?
    for (const getCard of cards.values()) {
      if (getCard().card.contains(evt.target)) {
        return;
      }
    }
    closeThis();
  }

  function handleKeydownEvents(evt) {
    if (evt.key === 'Escape' && levelStack.isNext(level.cid)) {
      closeThis();
    }
    trapFocusInstance?.(evt);
  }

  export function open(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (visible) return;
    tracker?.forceUpdate();
    fadeOutDuration = FADE_OUT_DURATION;
    visible = true;
    level = levelStack.add({ ignore: ignoreLevelStack });
    document.addEventListener('mousedown', handlePointerEvents);
    document.addEventListener('keydown', handleKeydownEvents);
    closeOther();
    trapFocusInstance = trapFocusStack.add(evt => {
      if (evt.key === 'Tab') {
        trapFocus(card, { selectPrevious: evt.shiftKey });
        evt.preventDefault();
      } else if (evt.key === 'ArrowLeft' && !trapFocusIgnoreArrows) {
        closeThis({ duration: 0 });
      } else if (evt.key === 'ArrowUp' && !trapFocusIgnoreArrows) {
        trapFocus(card, { selectPrevious: true });
        ensureFocusVisible();
        evt.preventDefault();
      } else if (evt.key === 'ArrowDown' && !trapFocusIgnoreArrows) {
        trapFocus(card);
        ensureFocusVisible();
        evt.preventDefault();
      }
    });
    previouslyFocused = document.activeElement;
  }
  export async function openAsSubmenuOnKeydown(evt) {
    if (evt.key === 'ArrowRight' || evt.key === ' ') {
      open(evt);
      // focus on the first item
      await tick();
      trapFocus(card);
    }
  }

  export function closeThis(opts = {}) {
    if (visible === false) return;
    const { duration = FADE_OUT_DURATION } = opts;
    fadeOutDuration = duration;
    levelStack.remove(level.cid);
    visible = false;
    document.removeEventListener('mousedown', handlePointerEvents);
    document.removeEventListener('keydown', handleKeydownEvents);
    deleteCard(level.cid);
    trapFocusStack.remove(trapFocusInstance?.cid);
    previouslyFocused?.focus();
  }

  export function closeOther() {
    if (!visible) return;
    closeAll({ ignore: [...closeIgnore, level.cid] });
  }

  export function getCard() {
    return { card, closeThis };
  }

  onDestroy(() => {
    closeThis();
  });
</script>

{#if visible && !hidden}
  <Popover
    {ignoreLevelStack}
    {placement}
    {offset}
    {level}
    anchorRect={tracker.rect}
    arrowAnchorRect={arrowTracker.rect}
    bind:eventualPlacement
    bind:arrowRect>
    <div bind:this={card} out:fade={{ duration: fadeOutDuration }}>
      <slot />
    </div>
  </Popover>
{/if}
