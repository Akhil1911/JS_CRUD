class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = new Map();
    this.middleware = [];
    this.history = [];
    this.maxHistory = 100;
    this.isDispatching = false;

    this.initialState = JSON.parse(JSON.stringify(initialState));
  }

  getState() {
    return this.state;
  }

  subscribe(key, callback) {
    if (!key || typeof callback !== "function") {
      return () => {};
    }

    this.subscribers.set(key, callback);

    return () => {
      this.subscribers.delete(key);
    };
  }

  unsubscribe(key) {
    if (!key) return false;

    return this.subscribers.delete(key);
  }

  dispatch(action) {
    if (!action || typeof action.type === "undefined") {
      console.warn("Invalid action:", action);
      return;
    }

    if (this.isDispatching) {
      console.warn("Dispatch already in progress");
      return;
    }

    this.isDispatching = true;

    try {
      const newState = this.reducer(this.state, action);

      if (newState !== this.state) {
        this.updateState(newState, action);
      }
    } catch (error) {
      console.error("Dispatch error:", error);
    } finally {
      this.isDispatching = false;
    }
  }

  updateState(newState, action) {
    const oldState = this.state;
    this.state = newState;

    this.addToHistory(oldState, action);

    this.notifySubscribers(action);
  }

  addToHistory(oldState, action) {
    this.history.push({
      state: oldState,
      action,
      timestamp: Date.now(),
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  notifySubscribers(action) {
    this.subscribers.forEach((callback, key) => {
      try {
        callback(this.state, action);
      } catch (error) {
        console.error(`Subscriber error for key ${key}:`, error);
      }
    });
  }

  setState(newState) {
    if (!newState || typeof newState !== "object") {
      return;
    }

    this.state = { ...this.state, ...newState };

    this.notifySubscribers({ type: "SET_STATE" });
  }

  get(path) {
    if (!path) return this.state;

    const keys = path.split(".");
    let value = this.state;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  set(path, value) {
    if (!path) return false;

    const keys = path.split(".");
    const lastKey = keys.pop();
    let current = this.state;

    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;

    this.notifySubscribers({ type: "SET_PATH", path, value });

    return true;
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(this.initialState));

    this.history = [];

    this.notifySubscribers({ type: "RESET" });
  }

  undo() {
    if (this.history.length === 0) return false;

    const lastEntry = this.history.pop();

    if (lastEntry && lastEntry.state) {
      this.state = lastEntry.state;
      this.notifySubscribers({ type: "UNDO", action: lastEntry.action });
      return true;
    }

    return false;
  }

  redo() {
    console.warn("Redo not implemented");
    return false;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }

  addMiddleware(middleware) {
    if (typeof middleware === "function") {
      this.middleware.push(middleware);
    }
  }

  removeMiddleware(middleware) {
    const index = this.middleware.indexOf(middleware);
    if (index > -1) {
      this.middleware.splice(index, 1);
    }
  }

  getMiddleware() {
    return this.middleware;
  }

  batch(actions) {
    if (!Array.isArray(actions)) return;

    this.isDispatching = true;

    try {
      actions.forEach((action) => {
        const newState = this.reducer(this.state, action);
        this.state = newState;
      });

      this.notifySubscribers({ type: "BATCH", actions });
    } finally {
      this.isDispatching = false;
    }
  }

  getSubscriberCount() {
    return this.subscribers.size;
  }

  hasSubscribers() {
    return this.subscribers.size > 0;
  }

  getSubscriberKeys() {
    return this.subscribers.keys();
  }

  clearSubscribers() {
    this.subscribers.clear();
  }

  reducer(state, action) {
    return state;
  }
}

const store = new Store({
  user: null,
  isAuthenticated: false,
  theme: "light",
  language: "en",
});

export default store;
