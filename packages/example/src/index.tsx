import { Parabola } from "@parabolajs/parabola";
import { serveStatic } from "hono/bun";
import { registerMain } from "./pages/main";
import { registerPoll } from "./pages/poll";
import { registerCounter } from "./pages/counter";
import { registerViews } from "./pages/views";
import { registerChat } from "./pages/chat";

export const parabola = new Parabola({
  styles: ["/styles.css"],
  routes: [
    {
      path: "/",
      target: "content",
      template: "welcome",
    },
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
    {
      path: "/chat",
      target: "content",
      template: "chat",
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
registerChat(parabola);
