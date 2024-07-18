import { Parabola } from "@parabolajs/parabola";

let views = 0;

type User = {
  name: string;
};

const users: User[] = [];

function addUser(invalidate: any) {
  const name = Math.random().toString(36).substring(7);
  users.push({
    name,
  });
  setTimeout(() => {
    users.splice(
      users.findIndex((u) => u.name === name),
      1
    );
    invalidate("users");
  }, 120000);
  invalidate("users");
}

export function registerViews(parabola: Parabola) {
  parabola.template("views", () => {
    return (
      <>
        <div
          p-load="views:increment"
          class="flex flex-col items-center py-12 gap-12"
        >
          <div class="text-center">
            <div p-template="views:count"></div> people have loaded this example
          </div>

          <div p-template="users"></div>
        </div>
      </>
    );
  });

  parabola.template("users", () => {
    return (
      <div class="space-y-4">
        <h2 class="text-xl">
          Recent Users (random character, clears after 2 min)
        </h2>

        <div className="flex gap-4 flex-wrap">
          {users.map((user) => (
            <div class="flex rounded-full size-10 bg-base-300 justify-center items-center">
              {user.name.substring(0, 1)}
            </div>
          ))}
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
    addUser(invalidate);
  });
}
