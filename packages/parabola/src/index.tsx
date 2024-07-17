import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket();

import { ControlBus } from "./bus";
import { Dispatcher } from "./dispatcher";
import { Renderer } from "./renderer";
import { serveStatic } from "hono/bun";

export class Parabola {
  private dispatcher: Dispatcher;
  private renderer: Renderer;
  private controlBus: ControlBus;

  constructor() {
    this.dispatcher = new Dispatcher();
    this.renderer = new Renderer(this.dispatcher);
    this.controlBus = new ControlBus(this.renderer);

    const app = new Hono();

    app.use(
      "/static/parabola.js",
      serveStatic({ path: "./packages/parabola/src/parabola.js" })
    );

    app.get("/", (c) => {
      return c.html(
        <html>
          <head>
            <meta charset="UTF-8" />
          </head>
          <body>
            <div p-template="main">loading...</div>

            <script src="/static/parabola.js"></script>
          </body>
        </html>
      );
    });

    app.get(
      "/ws",
      upgradeWebSocket((c) => {
        return {
          onOpen(_event, ws) {},
          onMessage: (evt, ws) => {
            const { type, payload } = JSON.parse(evt.data);
            if (type === "template") {
              const key = payload;
              this.dispatcher.subscribe(ws, key);
              const view = this.renderer.getTemplateFromCache(key);
              if (!view) {
                this.renderer.update(key, ws);
              } else {
                this.dispatcher.dispatch(
                  key,
                  JSON.stringify({ key, html: view }),
                  ws
                );
              }
            }
            if (type === "dispatch") {
              this.controlBus.invoke(payload.key, payload);
            }
          },
          onClose: (evt, ws) => {
            this.dispatcher.unsubscribeAll(ws);
          },
        };
      })
    );

    Bun.serve({
      fetch: app.fetch,
      websocket,
    });
  }

  template(key: string, cb: () => JSX.Element) {
    this.renderer.register(key, cb);
  }

  action(
    key: string,
    cb: (invalidate: (key: string) => void, data: any) => void
  ) {
    this.controlBus.on(key, cb);
  }
}
