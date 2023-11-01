<script lang="ts">
  import { Board, generate_solved_board } from "./lib/Game/Board";

  const board = new Board();
  const keys = [
    ["a", "b", "c", "d", "e", "f"],
    ["a", "b", "c", "d", "e", "f"],
    ["a", "b", "c", "d", "e", "f"],
    ["a", "b", "c", "d", "e", "f"],
    ["a", "b", "c", "d", "e", "f"],
    ["a", "b", "c", "d", "e", "f"],
  ] as const;

  document.body.setAttribute("data-theme", "dark");
</script>

<main class="grid grid-cols-6">
  {#each board as row, i}
    {#each row as cell}
      <button class="btn  grid grid-cols-3">
        {#each keys[i] as val}
          <span class:text-primary={cell.has(i)}>
            {val}
          </span>
        {/each}
      </button>
    {/each}
  {/each}
</main>
