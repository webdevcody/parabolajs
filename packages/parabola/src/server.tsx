import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket();

import { ControlBus } from "./bus";
import { Dispatcher } from "./dispatcher";
import { Renderer } from "./renderer";
import fs from "fs/promises";
import path from "path";

function Main({ styles, routes }: { styles?: string[]; routes?: any[] }) {
  return (
    <html data-theme="night">
      <head>
        <meta charset="UTF-8" />
        <title>Parabola</title>
        {styles?.map((style) => (
          <link rel="stylesheet" href={style} />
        ))}
      </head>
      <body>
        {/* <input type="hidden" id="routes" value={JSON.stringify(routes)} /> */}

        <div id="main" p-template="main">
          loading...
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.parabolaRoutes = ${JSON.stringify(routes)};
          `,
          }}
        ></script>

        <script src="/static/parabola.js"></script>
      </body>
    </html>
  );
}

export class Parabola {
  private dispatcher: Dispatcher;
  private renderer: Renderer;
  private controlBus: ControlBus;
  private app: Hono;

  getApp() {
    return this.app;
  }

  constructor(opts?: { styles?: string[]; routes?: any[] }) {
    this.dispatcher = new Dispatcher();
    this.renderer = new Renderer(this.dispatcher);
    this.controlBus = new ControlBus(this.renderer);

    const app = new Hono();
    this.app = app;

    app.get("/static/parabola.js", async (c) => {
      const filePath = path.join(__dirname, "./parabola.js");
      const js = await fs.readFile(filePath, {
        encoding: "utf-8",
      });
      return c.html(js);
    });

    app.get("/", (c) => {
      return c.html(<Main styles={opts?.styles} routes={opts?.routes} />);
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
            if (type === "action") {
              this.controlBus.invoke(payload.key, payload);
            }
          },
          onClose: (evt, ws) => {
            this.dispatcher.unsubscribeAll(ws);
          },
        };
      })
    );

    app.notFound((c) => {
      return c.html(<Main styles={opts?.styles} routes={opts?.routes} />);
    });

    Bun.serve({
      fetch: app.fetch,
      websocket,
    });
  }

  invalidate(key: string) {
    this.renderer.update(key);
  }

  // I'm not sure why this can't be JSXNode... it causes consumers to get type errors
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
