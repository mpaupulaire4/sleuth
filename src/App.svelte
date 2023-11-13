<script lang="ts">
  import { Capacitor } from "@capacitor/core";
  import {
    App,
    Page,
    Navbar,
    Block,
    BlockTitle,
    Sheet,
    Toolbar,
    Button,
    Link,
    Dialog,
    DialogButton,
  } from "konsta/svelte";
  import {
    ClueType,
    type Clue,
    SAVE_CLUE_KEY,
    cluesFromString,
    cluesToString,
  } from "./lib/Game/Clue";
  import { Board } from "./lib/Game/Board";
  import { generate_clues } from "./lib/Game";
  import { save, load, type Loadable, type Saveable } from "./lib/Storage";
  import { Stack } from "./lib/UndoRedo";
  import GridCell from "./components/GridCell.svelte";
  import EditCell from "./components/EditCell.svelte";
  import ClueComp from "./components/Clue.svelte";
  import { keys } from "./app";

  const stack = new Stack();
  const can_redo = stack.can_redo;
  const can_undo = stack.can_undo;

  const platform = Capacitor.getPlatform() === "ios" ? "ios" : "material";

  let board = new Board();
  let editCell: [number, number] | null = null;
  let clues: Clue[] = [];
  let finished = board.isFinished;
  let solved = false;

  const ClueSaver: Loadable & Saveable = {
    key: SAVE_CLUE_KEY,
    fromStorageString: (data) => {
      clues = cluesFromString(data);
    },
    toStorageString: () => cluesToString(clues),
  };

  // TODO: Loading states
  let loading = false;

  function board_change() {
    if (!board.changed) return;
    stack.action(board.changeSet);
    board.notify(true);
    editCell = null;
    persist();
    finished = board.isFinished;
    solved = clues.every((c) => c.validate(board));
  }

  function cancel_edit() {
    editCell = null;
  }

  function undo() {
    const changes = stack.undo();
    if (!changes) return;
    board.applyChangeSet(changes);
  }

  function redo() {
    const changes = stack.redo();
    if (!changes) return;
    board.applyChangeSet(changes);
  }

  async function persist() {
    await Promise.all([save(board), save(stack), save(ClueSaver)]);
  }

  async function loadAll() {
    loading = true;
    await Promise.all([load(board), load(stack), load(ClueSaver)]);
    finished = board.isFinished;
    solved = clues.every((c) => c.validate(board));
    loading = false;
  }

  async function newGame() {
    board = new Board();
    stack.clear();
    clues = generate_clues().filter((c) => {
      if (c.type === ClueType.Exact) {
        c.apply(board);
        return false;
      }
      return true;
    });
    finished = false;
    solved = false;
    persist();
  }

  loadAll();
</script>

<App theme={platform} safeAreas class="dark">
  <Page>
    <Navbar title="Sleuth">
      <Link onClick={newGame} navbar slot="right">New Game</Link>
    </Navbar>
    <Block>
      <div class="grid grid-cols-6 gap-y-1 gap-x-0.5">
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
      </div>
    </Block>
    <BlockTitle>Clues</BlockTitle>
    <Block>
      <!-- TODO: display clues -->
      <div class="grid grid-cols-6 gap-2">
        {#each clues as clue}
          <ClueComp {clue} rowDef={keys} {finished} />
        {/each}
      </div>
    </Block>

    <Toolbar class="fixed bottom-0">
      <div class="grid grid-cols-2 gap-2 w-full">
        <Button onClick={undo} disabled={!$can_undo}>Undo</Button>
        <Button onClick={redo} disabled={!$can_redo}>Redo</Button>
      </div>
    </Toolbar>

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
  <Dialog opened={solved} onBackdropClick={() => (solved = false)}>
    <svelte:fragment slot="title">Great Job!!!</svelte:fragment>
    You solved the puzzle!
    <svelte:fragment slot="buttons">
      <DialogButton onClick={newGame}>Start a New Game</DialogButton>
    </svelte:fragment>
  </Dialog>
</App>
