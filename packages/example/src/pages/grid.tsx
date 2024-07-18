import { Parabola } from "@parabolajs/parabola";

const GRID_SIZE = 20;

const grid: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => false)
);

export function registerGrid(parabola: Parabola) {
  parabola.template("grid", () => {
    return (
      <div class="items-center py-12">
        <h1 class="text-xl mb-4">Toggle anything on this realtime grid!</h1>

        {grid.map((row, rowIndex) => (
          <div p-template={`row:${rowIndex}`} />
        ))}
      </div>
    );
  });

  grid.forEach((row, rowIndex) => {
    const cols = row;

    parabola.template(`row:${rowIndex}`, () => {
      return (
        <div class="flex gap-2">
          {cols.map((isToggled, colIndex) => (
            <form p-action={`toggle:${rowIndex}`}>
              <input type="hidden" name="col" value={colIndex} />
              <button class="btn">{isToggled ? "🟩" : "🟥"}</button>
            </form>
          ))}
        </div>
      );
    });

    parabola.action(`toggle:${rowIndex}`, (invalidate, data) => {
      const { col } = data;
      grid[rowIndex][col] = !grid[rowIndex][col];
      invalidate(`row:${rowIndex}`);
    });
  });
}
