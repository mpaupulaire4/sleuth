import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import App from "./App.svelte";
import './keys.ts'

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
