import { Parabola } from "@parabolajs/parabola";
import { serveStatic } from "hono/bun";

export const parabola = new Parabola({
  styles: ["/styles.css"],
});

parabola
  .getApp()
  .use("/styles.css", serveStatic({ path: "./dist/styles.css" }));

const options = [
  {
    id: "1",
    text: "Ice cream",
    votes: 0,
  },
  {
    id: "2",
    text: "Banana Bread",
    votes: 0,
  },
  {
    id: "3",
    text: "Cookies",
    votes: 0,
  },
];

parabola.template("main", () => {
  return (
    <div class="mx-auto container">
      <div p-template="poll" />
    </div>
  );
});

parabola.template("poll", () => {
  return (
    <div class="flex gap-8 justify-center pt-12">
      {options.map((option) => (
        <form
          p-action="vote"
          class="flex flex-col gap-4 rounded bg-neutral-content text-black p-8 w-[200px]"
        >
          <div>{option.text}</div>
          <div>{option.votes} votes</div>
          <input type="hidden" name="optionId" value={option.id} />
          <button class="btn">vote</button>
        </form>
      ))}
    </div>
  );
});

parabola.action("vote", (invalidate, data) => {
  const voteId = data.optionId;
  const option = options.find((option) => option.id === voteId);
  if (!option) return;
  option.votes++;
  invalidate("poll");
});
