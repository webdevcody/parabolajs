import { Parabola } from "@parabolajs/parabola";

const MAX_MESSAGES = 100;
const messages: string[] = [];

export function registerChat(parabola: Parabola) {
  parabola.template("chat", () => {
    return (
      <div class="items-center py-12">
        <h1 class="text-xl">Send Messages to Everyone!</h1>

        <div class="flex flex-col gap-8 justify-center pt-12">
          <form p-action="sendMessage">
            <input
              required
              name="message"
              type="text"
              class="input input-bordered"
            />
            <button class="btn btn-primary">send</button>
          </form>

          <div p-template="messageList"></div>
        </div>
      </div>
    );
  });

  parabola.template("messageList", () => {
    return (
      <div class="flex flex-wrap gap-4">
        {messages.map((message) => (
          <div class="bg-base-200 p-4 rounded-lg">{message}</div>
        ))}
      </div>
    );
  });

  parabola.action("sendMessage", (invalidate, data) => {
    messages.unshift(data.message);
    messages.splice(MAX_MESSAGES);
    invalidate("messageList");
  });
}
