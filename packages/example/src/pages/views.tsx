import { Parabola } from "@parabolajs/parabola";

let views = 0;

export function registerViews(parabola: Parabola) {
  parabola.template("views", () => {
    return (
      <div p-load="views:increment" class="flex flex-col items-center py-12">
        <div class="text-center">
          <div p-template="views:count"></div> people have loaded this example
        </div>
      </div>
    );
  });

  parabola.template("views:count", () => {
    return <span>{views}</span>;
  });

  parabola.action("views:increment", (invalidate) => {
    views++;
    invalidate("views:count");
  });
}
