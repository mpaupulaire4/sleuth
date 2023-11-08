<script lang="ts">
  import clsx from "clsx";

  export let square = true;
  export let visible = true;
  let className: string = "";

  export { className as class };
</script>

<svg
  viewBox={square ? '0 0 15 15' : '0 0 30 20'}
  class={clsx(
    className,
    "transition-opacity transition-300",
    visible ? "opacity-100" : "opacity-0",
    {
      "aspect-square": square,
    }
  )}
>
  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle">
    <slot />
  </text>
</svg>
