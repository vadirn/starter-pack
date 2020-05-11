<script>
  import { setContext } from 'svelte';
  import { observable, setChanged } from 'observable';
  import { monitor } from 'session/process-monitor';
  export let pageCache;
  export let component;
  export let forward;
  export let forwardOnClick;
  export let redirect;
  export let redirectOnClick;
  export let props;
  export let scrollState;

  $: window.scrollTo(scrollState.x, scrollState.y);

  setContext('page', pageCache);
  setContext('forward', forward);
  setContext('forwardOnClick', forwardOnClick);
  setContext('redirect', redirect);
  setContext('redirectOnClick', redirectOnClick);

  function ensureFocusVisible() {
    document.body.classList.add('js-focus-visible');
  }

  setContext('ensureFocusVisible', ensureFocusVisible);

  const input = observable('');

  function setInput(evt) {
    // skip if event key exists and is not tab
    if (evt.key !== undefined && evt.key !== 'Tab') {
      return;
    }
    setChanged(
      input,
      {
        keydown: 'keyboard',
        keyup: 'keyboard',
        mousedown: 'mouse',
        pointerdown: 'pointer',
        touchstart: 'touch',
      }[evt.type] ?? ''
    );
  }

  window.addEventListener('keydown', setInput);
  if (window.PointerEvent) {
    window.addEventListener('pointerdown', setInput);
  } else {
    window.addEventListener('mousedown', setInput);
    window.addEventListener('touchstart', setInput);
  }

  input.subscribe(curInput => {
    if (curInput === 'keyboard') {
      ensureFocusVisible();
    } else {
      document.body.classList.remove('js-focus-visible');
    }
  });

  const busy = monitor.busy;
</script>

{#if $busy}
  <div
    class="fixed top-0 left-0 bg-black text-white text-body-2"
    style="z-index: 999;">
    Loading...
  </div>
{/if}

<svelte:component this={component} {...props} />
