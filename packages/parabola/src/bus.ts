import type { Renderer } from "./renderer";

type Invalidator = (key: string) => void;

export class ControlBus {
  private renderer: Renderer;
  private actions = new Map<
    string,
    (invalidate: Invalidator, data: any) => void
  >();

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  on(key: string, cb: (invalidate: Invalidator, data: any) => void) {
    if (this.actions.has(key)) {
      console.error(`Action with key ${key} already exists`);
      return;
    }
    this.actions.set(key, cb);
  }

  invoke(key: string, data: any) {
    const action = this.actions.get(key);
    if (!action) {
      return;
    }
    const invalidate: Invalidator = (key: string) => {
      this.renderer.update(key);
    };
    action(invalidate, data.data);
  }
}
