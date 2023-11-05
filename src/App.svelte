<script lang="ts">
  import { Board } from "./lib/Game/Board";
  import Cell from "./components/Cell.svelte";

  type RowDef = readonly [string[], string, string][];

  const board = new Board();
  const keys: RowDef = [
    [["S", "L", "E", "U", "T", "H"], "", ""],
    [["a", "b", "c", "d", "e", "f"], "", ""],
    [["a", "b", "c", "d", "e", "f"], "", ""],
    [["a", "b", "c", "d", "e", "f"], "", ""],
    [["a", "b", "c", "d", "e", "f"], "", ""],
    [["a", "b", "c", "d", "e", "f"], "", ""],
  ];

  document.body.setAttribute("data-theme", "dark");
  board.remove(0, 0, 0, true);
</script>

<main class="grid grid-cols-6 grid-gap-2">
  {#each board as row, i}
    {#each row as cell}
      <Cell symbols={keys[i][0]} {cell} />
    {/each}
  {/each}
</main>
