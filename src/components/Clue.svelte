<script lang="ts" context="module">
  import { ClueType, type Clue } from "../lib/Game/Clue";
  const TypeSymbols: Record<ClueType, string> = {
    [ClueType.Same]: "|",
    [ClueType.Adjacent]: "-",
    [ClueType.Exact]: "!",
    [ClueType.Sequential]: "=",
    [ClueType.Before]: "<",
  };
</script>

<script lang="ts">
  import clsx from "clsx";

  import type { RowDef } from "../app";
  import Base from "./Cell/Base.svelte";

  export let clue: Clue;
  export let rowDef: RowDef;
  export let finished = false;
  export let markedCompleted = false;

  $: tile1 = clue.tiles[0];
  $: tile1Def = rowDef[tile1[0]];
  $: tile2 = clue.tiles[1] || [];
  $: tile2Def = rowDef[tile2[0]] || [];
</script>

<button
  class={clsx(
    "grid grid-cols-3 clue border-2 text-base lg:text-5xl text-neutral",
    finished && !$clue && "border-red-500", markedCompleted && "opacity-40"
  )}
  on:click={() => markedCompleted=!markedCompleted}
>
  <Base square visible class={clsx(tile1Def[1])}>
    {tile1Def[0][tile1[1]]}
  </Base>
  {#if clue.type !== ClueType.Sequential}
    <!-- <Base square visible class="fill-white">{TypeSymbols[clue.type]}</Base> -->
    <Base square visible class="text-base-content">{TypeSymbols[clue.type]}</Base>
  {/if}
  <Base square visible class={clsx(tile2Def[1])}>
    {tile2Def[0][tile2[1]]}
  </Base>
  {#if clue.type === ClueType.Sequential}
    {@const tile = clue.tiles[2]}
    {@const def = rowDef[tile[0]]}
    <Base square visible class={clsx(def[1])}>
      {def[0][tile[1]]}
    </Base>
  {/if}
  </button>
