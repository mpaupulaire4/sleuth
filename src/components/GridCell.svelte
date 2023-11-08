<script lang="ts">
  import clsx from "clsx";
  import type { Cell } from "../lib/Game/Cell";
  import Base from "./Cell/Base.svelte";

  export let cell: Cell<number>;
  export let symbols: readonly string[] = [];
  let className: string = "";

  export { className as class };
</script>

<button
  on:click
  class="grid {clsx({
    'grid-cols-1': $cell.size === 1,
    'grid-cols-3': $cell.size !== 1,
  })}"
>
  {#if $cell.size === 1}
    <Base square={false} visible class={className}>
      {symbols[$cell.values().next().value]}
    </Base>
  {:else}
    {#each symbols as val, i}
      <Base square={$cell.size !== 1} visible={$cell.has(i)} class={className}>
        {val}
      </Base>
    {/each}
  {/if}
</button>
