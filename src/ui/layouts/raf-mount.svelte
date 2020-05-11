<script context="module">
  // pre allocate random numbers
  const lookupTable = [];
  for (let i = 0; i < 1000; i += 1) {
    lookupTable[i] = 1 + ((Math.random() * 4) << 0);
  }
  let j = 0;
  function random() {
    return ++j >= lookupTable.length ? lookupTable[(j = 0)] : lookupTable[j];
  }
</script>

<script>
  import { tick, onMount } from 'svelte';
  import { rafTick } from 'fn-helpers/raf-throttle';
  let render = false;
  export let count = random();

  onMount(async () => {
    await tick();
    for (let i = 0; i < count; i += 1) {
      await rafTick();
    }
    render = true;
  });
</script>

{#if render}
  <slot />
{/if}
