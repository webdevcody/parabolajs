import { Parabola } from "../../parabola/src";

export const parabola = new Parabola();

const comments: string[] = [];
let notifications: number = 0;

parabola.template("main", () => {
  return (
    <div>
      <div p-template="header" />
      HELLO WORLD
      <div p-template="viewComments" />
    </div>
  );
});

parabola.template("header", () => {
  return <header>LOGO {notifications}</header>;
});

parabola.template("viewComments", () => {
  return (
    <div>
      <form p-dispatch="createComment">
        <input name="comment" />
        <button>submit</button>
      </form>

      <div p-template="comments" />
    </div>
  );
});

parabola.template("comments", () => {
  console.log("re-render comments template");
  return (
    <ul>
      {comments.map((comment) => (
        <li>{comment}</li>
      ))}
    </ul>
  );
});

parabola.action("createComment", (invalidate, data) => {
  console.log("createComment", data);
  comments.push(data.comment);
  notifications++;
  invalidate("header");
  invalidate("comments");
});
