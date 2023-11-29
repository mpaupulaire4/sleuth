<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Board } from "../lib/Game/Board";
  import Base from "./Cell/Base.svelte";
  import clsx from "clsx";
  import { keys } from "../app";

  const dispatch = createEventDispatcher<{
    done: null;
  }>();

  export let board: Board;

  let dialog: HTMLDialogElement;
  let row: number = 0;
  let col: number = 0;
  let mousedownTime: number;

  $: symbols = keys[row][0];
  $: onClass = keys[row][1];
  $: offClass = keys[row][2];
  $: cell = board.get(row, col)!;
  $: set = new Set([...cell]);

  function onMouseDown() {
    mousedownTime = new Date().getTime()
  }

  function onMouseUp(item: number) {
    const timeDifference = new Date().getTime() - mousedownTime;
    console.log(timeDifference)
    if (timeDifference > 500) { // considered a button press
      select(item)
    } else { // considered a button click
      toggle(item)
    }
  }

  function select(item: number) {
    set = new Set([item]);
  }

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
    dialog.close();
  }

  export function open(r: number, c: number) {
    row = r;
    col = c;
    dialog.showModal();
  }
</script>

<dialog id="edit-cells-modal" class="modal modal-bottom" bind:this={dialog}>
  <!-- toolbar -->
  <div class="modal-box">
    <div class="navbar text-3xl">
      <p class="navbar-start">Column {col}</p>
      <div class="navbar-end">
        <button on:click={submit} class="btn btn-ghost btn-lg">Done</button>
      </div>
    </div>

    <div>
      <div class="grid gap-1 grid-cols-3">
        {#each symbols as val, i}
      <button on:mousedown={onMouseDown} on:mouseup={() => onMouseUp(i)}>
            <Base
              class={clsx(
                "text-5xl text-black",
                set.has(i) ? onClass : offClass
              )}
            >
              {val}
            </Base>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
