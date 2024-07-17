function connect() {
  const ws = new WebSocket("ws://localhost:3000/ws");
  const subscriptions = new Map();

  function registerTemplates(parent = document) {
    const elements = parent.querySelectorAll("[p-template]");
    elements.forEach((element) => {
      const key = element.getAttribute("p-template");
      if (!subscriptions.has(key)) {
        subscriptions.set(key, new Set());
      }
      subscriptions.get(key).add(element);
      ws.send(JSON.stringify({ type: "template", payload: key }));
    });
  }

  function registerActions(parent = document) {
    const forms = parent.querySelectorAll("[p-action]");
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const key = form.getAttribute("p-action");
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        ws.send(JSON.stringify({ type: "action", payload: { key, data } }));
      });
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const subscription = subscriptions.get(data.key);
    if (!subscription) {
      return;
    }
    const template = document.createElement("template");
    template.innerHTML = data.html;

    for (const element of subscription) {
      element.innerHTML = "";
      element.appendChild(template.content.cloneNode(true));
      registerTemplates(element);
      registerActions(element);
    }
  };

  ws.onclose = () => {
    setTimeout(() => {
      connect();
    }, 1000);
  };

  ws.onopen = () => {
    registerTemplates();
    registerActions();
  };
}

connect();
