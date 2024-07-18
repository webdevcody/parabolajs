import { Parabola } from "@parabolajs/parabola";

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

export function registerPoll(parabola: Parabola) {
  parabola.template("poll", () => {
    return (
      <div class="flex gap-8 justify-center pt-12">
        {options.map((option) => (
          <form
            p-action="vote"
            class="card bg-base-300 w-96 shadow-xl flex flex-col gap-4 rounded p-8"
          >
            <div>{option.text}</div>
            <div>{option.votes} votes</div>
            <input type="hidden" name="optionId" value={option.id} />
            <button class="btn btn-primary">vote</button>
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
}
