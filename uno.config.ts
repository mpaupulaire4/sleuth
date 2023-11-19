import { defineConfig, presetWind, presetIcons } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";
import { presetDaisy } from "unocss-preset-daisy";

export default defineConfig({
  presets: [
    presetWind({}),
    presetIcons({}),
    presetDaisy({
      themes: true,
    }),
  ],
  extractors: [extractorSvelte()],
});
