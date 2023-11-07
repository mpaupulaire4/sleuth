<script lang="ts">
  import { Board, type Change } from "./lib/Game/Board";
  import GridCell from "./components/GridCell.svelte";
  import EditCell from "./components/EditCell.svelte";

  type RowDef = readonly [string[], string, string][];

  const keys: RowDef = [
    [["S", "L", "E", "U", "T", "H"], "bg-accent fill-white", "fill-accent"],
    [["S", "L", "E", "U", "T", "H"], "bg-accent fill-white", "fill-accent"],
    [["S", "L", "E", "U", "T", "H"], "bg-accent fill-white", "fill-accent"],
    [["S", "L", "E", "U", "T", "H"], "bg-accent fill-white", "fill-accent"],
    [["S", "L", "E", "U", "T", "H"], "bg-accent fill-white", "fill-accent"],
    [["S", "L", "E", "U", "T", "H"], "bg-accent fill-white", "fill-accent"],
  ];

  // TODO: load from save state if it exists
  // new board otherwise
  let board = new Board();
  let editCell: [number, number] | null = null;

  // TODO:
  // - load from save
  // - rest of undo redo logic
  const stack: Array<Set<Change>> = [];

  document.body.setAttribute("data-theme", "dark");
  board.remove(0, 0, 0, true);

  function board_change() {
    stack.push(board.changeSet);
    board.notify(true);
    editCell = null;
  }

  function cancel_edit() {
    editCell = null;
  }
</script>

<main class="grid grid-cols-6 grid-gap-2">
  {#each board as row, i}
    {#each row as cell, j}
      <GridCell
        symbols={keys[i][0]}
        class={keys[i][1]}
        {cell}
        on:click={() => {
          editCell = [i, j];
        }}
      />
    {/each}
  {/each}
</main>

<section>clues</section>

<section>
  {#if editCell}
    <EditCell
      on:done={board_change}
      on:cancel={cancel_edit}
      {board}
      row={editCell[0]}
      col={editCell[1]}
      symbols={keys[editCell[0]][0]}
      onClass={keys[editCell[0]][1]}
      offClass={keys[editCell[0]][2]}
    />
  {/if}
</section>
