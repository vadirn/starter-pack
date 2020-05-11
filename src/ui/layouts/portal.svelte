<script>
  import { onMount } from 'svelte';

  let className = '';
  export { className as class };
  export let style = '';
  let el;

  onMount(() => {
    // do the additional wrapping
    // so that when a component got destroyed, it is first detached from portal element
    // and then portal gets removed from body
    const portal = document.createElement('div');
    portal.appendChild(el);
    document.body.appendChild(portal);
    return () => {
      document.body.removeChild(portal);
    };
  });
</script>

<div class={className} {style} bind:this={el}>
  <slot />
</div>
