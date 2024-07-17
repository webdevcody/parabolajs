import type { WSContext } from "hono/ws";

export class Dispatcher {
  private subscriptions = new Map<string, Set<WSContext>>();

  subscribe(ws: WSContext, key: string) {
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    console.log("user subscribed to ", key);
    this.subscriptions.get(key).add(ws);
  }

  unsubscribe(ws: WSContext, key: string) {
    this.subscriptions.get(key).delete(ws);
  }

  unsubscribeAll(ws: WSContext) {
    this.subscriptions.forEach((sockets) => {
      sockets.delete(ws);
    });
  }

  dispatch(key: string, data: string, ws?: WSContext) {
    if (ws) {
      ws.send(data);
      return;
    }

    const sockets = this.subscriptions.get(key);
    if (!sockets) {
      return;
    }
    for (const socket of sockets) {
      socket.send(data.toString());
    }
  }
}
