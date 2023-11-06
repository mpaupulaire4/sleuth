<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Board } from "../lib/Game/Board";
  import Base from "./Cell/Base.svelte";

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

  function cancel() {
    dispatch("cancel", null);
  }
</script>

<div class="grid gap-1 grid-cols-3">
  {#each symbols as val, i}
    <button on:click={() => toggle(i)}>
      <Base class={set.has(i) ? onClass : offClass}>
        {val}
      </Base>
    </button>
  {/each}
</div>

<button on:click={submit}>done</button>
<button on:click={cancel}>cancel</button>
