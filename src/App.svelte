<script lang="ts">
  import { App, Page, Navbar, Block, Sheet, Toolbar } from "konsta/svelte";
  import { Board, type Change } from "./lib/Game/Board";
  import GridCell from "./components/GridCell.svelte";
  import EditCell from "./components/EditCell.svelte";
  import { keys } from "./app";
  // TODO: win/ lose states
  // TODO: load from save state if it exists
  // new board otherwise
  let board = new Board();
  let editCell: [number, number] | null = null;

  // TODO:
  // - load from save state
  // - rest of undo redo logic
  const stack: Array<Set<Change>> = [];

  function board_change() {
    stack.push(board.changeSet);
    board.notify(true);
    editCell = null;
  }

  function cancel_edit() {
    editCell = null;
  }

  board.remove(0, 0, 0, true);
</script>

<App theme="material" safeAreas class="dark">
  <Page>
    <Navbar title="Sleuth" />
    <Block>
      <p class="grid grid-cols-6 gap-y-1 gap-x-0.5">
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
      </p>

      <section>clues</section>
    </Block>
    <!-- TODO: toolbar for undo/ redo-->
    <Sheet
      backdrop
      opened={!!editCell}
      onBackdropClick={cancel_edit}
      class="w-full"
    >
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
    </Sheet>
  </Page>
</App>
