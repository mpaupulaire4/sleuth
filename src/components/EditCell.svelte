<script lang="ts">
  import { Block, Toolbar, Link } from "konsta/svelte";

  import { createEventDispatcher } from "svelte";
  import type { Board } from "../lib/Game/Board";
  import Base from "./Cell/Base.svelte";
  import clsx from "clsx";

  const dispatch = createEventDispatcher<{
    done: null;
    cancel: null;
  }>();

  export let board: Board;
  export let row: number;
  export let col: number;
  export let symbols: readonly string[];
  export let onClass: string;
  export let offClass: string;

  $: cell = board.get(row, col)!;
  $: set = new Set([...cell]);

  function toggle(item: number) {
    if (set.has(item)) {
      set.delete(item);
    } else {
      set.add(item);
    }
    set = new Set(set);
  }

  function submit() {
    for (let item of set) {
      if (!cell.has(item)) {
        board.add(row, col, item);
      }
    }
    for (let item of cell) {
      if (!set.has(item)) {
        board.remove(row, col, item);
      }
    }
    dispatch("done", null);
  }
</script>

<Toolbar top>
  <p class="left">Column {col}</p>
  <div class="right">
    <Link toolbar onClick={submit} class="right">Done</Link>
  </div>
</Toolbar>
<Block>
  <div class="grid gap-1 grid-cols-3">
    {#each symbols as val, i}
      <button on:click={() => toggle(i)}>
        <Base class={clsx("text-5xl text-black", set.has(i) ? onClass : offClass)}>
          {val}
        </Base>
      </button>
    {/each}
  </div>
</Block>
