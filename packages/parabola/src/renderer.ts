import type { WSContext } from "hono/ws";
import type { Dispatcher } from "./dispatcher";

export class Renderer {
  private dispatcher: Dispatcher;
  private templates = new Map<string, () => string>();
  private cache = new Map<string, string>();

  constructor(dispatcher: Dispatcher) {
    this.dispatcher = dispatcher;
  }

  register(key: string, cb: () => string) {
    this.templates.set(key, cb);
  }

  getTemplateFromCache(key: string) {
    return this.cache.get(key);
  }

  update(key: string, ws?: WSContext) {
    const template = this.templates.get(key);
    if (!template) {
      return;
    }
    const html = template().toString();
    this.cache.set(key, html);
    this.dispatcher.dispatch(key, JSON.stringify({ key, html }), ws);
  }
}
