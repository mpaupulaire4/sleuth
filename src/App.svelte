<script lang="ts">
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
  import EditCells from "./components/EditCell.svelte";
  import ClueComp from "./components/Clue.svelte";

  export type RowDef = readonly [string[], string, string][];

  export const keys: RowDef = [
    [["1", "2", "3", "4", "5", "6"], "bg-red-300", "text-red-300"],
    [["√", "^", "×", "÷", "+", "-"], "bg-amber-300", "text-amber-300"],
    [["$", "€", "£", "¥", "₣", "₹"], "bg-lime-300", "text-lime-300"],
    [["#", "%", "&", "!", "?", ";"], "bg-teal-300", "text-teal-300"],
    [["Δ", "θ", "λ", "π", "Σ", "Ω"], "bg-blue-300", "text-blue-300"],
    [["S", "L", "E", "U", "T", "H"], "bg-purple-300", "text-purple-300"],
  ];

  const stack = new Stack();
  const can_redo = stack.can_redo;
  const can_undo = stack.can_undo;

  let board = new Board();
  let clues: Clue[] = [];
  let finished = board.isFinished;
  let solved = false;

  let editDialog: EditCells;
  let winDialog: HTMLDialogElement;

  const ClueSaver: Loadable & Saveable = {
    key: SAVE_CLUE_KEY,
    fromStorageString: (data) => {
      clues = cluesFromString(data);
    },
    toStorageString: () => cluesToString(clues),
  };

  let loading = false;

  function board_change() {
    if (!board.changed) return;
    stack.action(board.changeSet);
    board.notify(true);
    persist();
    finished = board.isFinished;
    solved = clues.every((c) => c.validate(board));
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
    loading = true;
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
    await persist();
    loading = false;
  }

  loadAll();

  document.body.setAttribute("data-theme", "dark");

  $: solved && winDialog?.showModal();
</script>

<div class="navbar">
  <div class="navbar-start" />
  <div class="navbar-center">
    <h1 class="btn btn-ghost text-xl">Sleuth</h1>
  </div>
  <div class="navbar-end">
    <button class="btn btn-ghost" on:click={newGame} disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner" />
      {/if}
      New Game
    </button>
  </div>
</div>

<div class="grid grid-cols-6 gap-y-1 gap-x-0.5">
  {#each board as row, i}
    {#each row as cell, j}
      <GridCell
        symbols={keys[i][0]}
        class={keys[i][1]}
        {cell}
        on:click={() => {
          editDialog.open(i, j);
        }}
      />
    {/each}
  {/each}
</div>

<!-- <BlockTitle>Clues</BlockTitle> -->
<div class="grid grid-cols-6 gap-2 mt-4">
  {#each clues as clue}
    <ClueComp {clue} rowDef={keys} {finished} />
  {/each}
</div>

<div
  class="fixed bottom-0 grid grid-cols-2 gap-2 w-full mx-auto left-0 right-0 container"
>
  <button on:click={undo} disabled={!$can_undo} class="btn btn-outline">
    Undo
  </button>
  <button on:click={redo} disabled={!$can_redo} class="btn btn-outline">
    Redo
  </button>
</div>

<EditCells bind:this={editDialog} on:done={board_change} {board} />

<dialog class="modal" bind:this={winDialog}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Great Job!</h3>
    <p class="py-4">You solved the puzzle!</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn" on:click={newGame}>New Game</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
