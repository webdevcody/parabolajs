function connect() {
  const ws = new WebSocket("ws://localhost:3000/ws");
  const subscriptions = new Map();

  function registerTemplates(parent = document) {
    console.log("registerTemplates");
    const elements = parent.querySelectorAll("[p-template]");
    elements.forEach((element) => {
      const key = element.getAttribute("p-template");
      if (!subscriptions.has(key)) {
        subscriptions.set(key, new Set());
      }
      subscriptions.get(key).add(element);
      console.log("subscribing to template", key);
      ws.send(JSON.stringify({ type: "template", payload: key }));
    });
  }

  function registerDispatch(parent = document) {
    const forms = parent.querySelectorAll("[p-dispatch]");
    console.log(parent, forms);
    forms.forEach((form) => {
      console.log(form);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const key = form.getAttribute("p-dispatch");
        const formData = new FormData(form);
        // convert formData to an object
        const data = Object.fromEntries(formData);
        console.log("submitting form", key, data);
        ws.send(JSON.stringify({ type: "dispatch", payload: { key, data } }));
      });
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("got a message", data);
    const subscription = subscriptions.get(data.key);
    if (!subscription) {
      return;
    }

    // convert data.html to a dom element, check for any p-templates, and subscribe
    console.log(data.html);
    const template = document.createElement("template");
    template.innerHTML = data.html;

    for (const element of subscription) {
      element.innerHTML = "";
      element.appendChild(template.content.cloneNode(true));
      registerTemplates(element);
      registerDispatch(element);
    }
  };

  ws.onclose = () => {
    console.log("on close");
    setTimeout(() => {
      connect();
    }, 1000);
  };

  ws.onopen = () => {
    console.log("on open");
    registerTemplates();
    registerDispatch();
  };
}

connect();
