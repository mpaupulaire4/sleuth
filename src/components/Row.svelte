<script lang="ts">
  import { Cell } from "../lib/Game/Cell";
  import clsx from "clsx";

  export let row: Iterable<Cell<number>> = [];
  export let symbols: readonly string[] = [];
  export let color: string = "fill-primary";
  // export let foreground: string;
</script>

{#each row as cell}
  <button
    class="grid gap-1 {clsx({
      'grid-cols-1': cell.size === 1,
      'grid-cols-3': cell.size !== 1,
    })}"
  >
    {@const list = cell.size === 1 ? cell : symbols}
    {#each list as val, i}
      <svg
        viewBox="0 0 20 20"
        class="aspect-square {clsx(cell.has(i) && color)}"
      >
        {#if cell.has(i)}
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
            {val}
          </text>
        {/if}
      </svg>
    {/each}
  </button>
{/each}
