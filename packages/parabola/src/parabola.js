function connect() {
  const ws = new WebSocket("/ws");
  const subscriptions = new Map();

  let isFirstPageLoad = true;

  function register(parent = document) {
    registerTemplates(parent);
    registerActions(parent);
    registerHref(parent);
    registerLoad(parent);
  }

  function clearSubscriptions() {
    subscriptions.clear();
  }

  window.onpopstate = (event) => {
    if (event.state) {
      const targetEl = document.getElementById(event.state.target);
      targetEl.innerHTML = `<div p-template='${event.state.template}'></div>`;
      clearSubscriptions();
      register(targetEl);
    }
  };

  function registerLoad(parent = document) {
    const elements = parent.querySelectorAll("[p-load]");
    elements.forEach((element) => {
      const key = element.getAttribute("p-load");
      ws.send(JSON.stringify({ type: "action", payload: { key, data: null } }));
    });
  }

  function registerHref(parent = document) {
    const elements = parent.querySelectorAll("[p-href]");
    elements.forEach((element) => {
      const href = element.getAttribute("p-href");
      const target = element.getAttribute("p-target");
      const swap = element.getAttribute("p-swap");
      const targetEl = document.getElementById(target);

      function onClick(event) {
        event.preventDefault();
        history.pushState(
          {
            template: swap,
            target,
          },
          "",
          href
        );
        targetEl.innerHTML = `<div p-template='${swap}'></div>`;
        clearSubscriptions();
        register(targetEl);
      }

      element.removeEventListener("click", onClick);
      element.addEventListener("click", onClick);
    });
  }

  function registerTemplates(parent = document) {
    const path = window.location.pathname;

    const elements = parent.querySelectorAll("[p-template]");
    elements.forEach((element) => {
      let key = element.getAttribute("p-template");
      const id = element.getAttribute("id");

      for (const route of window.parabolaRoutes) {
        if (route.path === path && id === route.target) {
          key = route.template;
          element.setAttribute("p-template", key);
          history.replaceState(
            {
              template: key,
              target: route.target,
            },
            ""
          );
        }
      }
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
      function onSubmit(event) {
        event.preventDefault();
        const key = form.getAttribute("p-action");
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        form.reset();
        ws.send(JSON.stringify({ type: "action", payload: { key, data } }));
      }
      form.removeEventListener("submit", onSubmit);
      form.addEventListener("submit", onSubmit);
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
      register(element);
    }
  };

  ws.onclose = () => {
    setTimeout(() => {
      connect();
    }, 1000);
  };

  ws.onopen = () => {
    register();
    isFirstPageLoad = false;
  };
}

connect();
