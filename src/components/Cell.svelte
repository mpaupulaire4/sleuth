<script lang="ts">
  import type { Cell } from "../lib/Game/Cell";
  import clsx from "clsx";

  export let cell: Cell<number>;
  export let symbols: readonly string[] = [];
  export let color: string = "fill-primary";

  $: list = cell.size === 1 ? [symbols[cell.values().next().value!]] : symbols;
</script>

<button
  on:click
  class="grid gap-1 {clsx({
    'grid-cols-1': cell.size === 1,
    'grid-cols-3': cell.size !== 1,
  })}"
>
  {#each list as val, i}
    <svg
      viewBox="0 0 30 20"
      class={clsx({
        "aspect-square": cell.size !== 1,
        "bg-accent fill-white": cell.has(i),
      })}
    >
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle">
        {cell.has(i) ? val : ""}
      </text>
    </svg>
  {/each}
</button>
