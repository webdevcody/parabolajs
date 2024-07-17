import { Parabola } from "../../parabola/src";

export const parabola = new Parabola();

const options = [
  {
    id: "1",
    text: "option 1",
    votes: 0,
  },
  {
    id: "2",
    text: "option 2",
    votes: 0,
  },
];

parabola.template("main", () => {
  return (
    <div>
      <div p-template="poll" />
    </div>
  );
});

parabola.template("poll", () => {
  return (
    <div>
      {options.map((option) => (
        <form p-action="vote">
          {option.text} - ({option.votes} votes)
          <input type="hidden" name="optionId" value={option.id} />
          <button>vote</button>
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
