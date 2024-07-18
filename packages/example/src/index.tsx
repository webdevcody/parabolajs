import { Parabola } from "@parabolajs/parabola";
import { serveStatic } from "hono/bun";
import { registerMain } from "./pages/main";
import { registerPoll } from "./pages/poll";
import { registerCounter } from "./pages/counter";
import { registerViews } from "./pages/views";

export const parabola = new Parabola({
  styles: ["/styles.css"],
  routes: [
    {
      path: "/poll",
      target: "content",
      template: "poll",
    },
    {
      path: "/views",
      target: "content",
      template: "views",
    },
    {
      path: "/counter",
      target: "content",
      template: "counter",
    },
  ],
});

parabola
  .getApp()
  .use("/styles.css", serveStatic({ path: "./dist/styles.css" }));

registerMain(parabola);
registerPoll(parabola);
registerCounter(parabola);
registerViews(parabola);
