import { Parabola } from "@parabolajs/parabola";

export function registerCounter(parabola: Parabola) {
  let count = 0;

  parabola.template("counter", () => {
    return (
      <div class="flex flex-col items-center py-12">
        <div class="text-center">{count}</div>
        <div class="flex gap-8 justify-center pt-12">
          <form p-action="decrement">
            <button class="btn btn-primary">decrement</button>
          </form>

          <form p-action="increment">
            <button class="btn btn-primary">increment</button>
          </form>
        </div>
      </div>
    );
  });

  parabola.action("increment", (invalidate) => {
    count++;
    invalidate("counter");
  });

  parabola.action("decrement", (invalidate) => {
    count--;
    invalidate("counter");
  });
}
