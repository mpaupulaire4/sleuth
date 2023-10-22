<script lang="ts">
  import { generate_solved_board } from "./lib/Game/Board";

  const board = generate_solved_board();
</script>

<table>
  {#each board as row}
    <tr>
      {#each row as cell}
        <td>{cell}</td>
      {/each}
    </tr>
  {/each}
</table>

<main>
  <h1>Vite + Svelte</h1>
</main>
