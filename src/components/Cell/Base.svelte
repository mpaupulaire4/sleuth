<script lang="ts">
  import clsx from "clsx";

  export let square = true;
  export let visible = true;
  let className: string = "";

  export { className as class };
</script>

<svg
  viewBox="0 0 30 20"
  class={clsx({
    [className]: true,
    "aspect-square": square,
    invisible: !visible,
  })}
>
  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle">
    <slot />
  </text>
</svg>
