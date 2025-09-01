class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.history = [];
    this.maxHistory = 50;

    window.addEventListener("popstate", this.handlePopState.bind(this));
    window.addEventListener("load", this.handleLoad.bind(this));
  }

  addRoute(path, handler, options = {}) {
    if (!path || !handler) {
      return false;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    this.routes.set(normalizedPath, {
      handler,
      options,
      params: {},
    });

    return true;
  }

  removeRoute(path) {
    if (!path) return false;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    this.routes.delete(normalizedPath);
    return true;
  }

  navigate(path, options = {}) {
    if (!path) {
      return this.navigateToCurrent();
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (!this.routes.has(normalizedPath)) {
      console.warn(`Route ${normalizedPath} not found`);

      return this.executeRoute(normalizedPath, { handler: () => {} });
    }

    const route = this.routes.get(normalizedPath);

    try {
      this.executeRoute(normalizedPath, route);
      this.updateHistory(normalizedPath, options);
      this.updateURL(normalizedPath, options);
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  }

  executeRoute(path, route) {
    if (!route || !route.handler) {
      return;
    }

    try {
      const result = route.handler(path, route.params);

      if (result && typeof result.then === "function") {
        result.catch((error) => {
          console.error("Route handler error:", error);
        });
      }

      this.currentRoute = path;
    } catch (error) {
      console.error("Route execution failed:", error);
    }
  }

  updateHistory(path, options) {
    if (options.replace) {
      window.history.replaceState(options.state || {}, "", path);
    } else {
      window.history.pushState(options.state || {}, "", path);
    }

    this.history.push({
      path,
      timestamp: Date.now(),
      state: options.state,
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  updateURL(path, options = {}) {
    if (options.updateURL !== false) {
      const url = new URL(window.location.href);
      url.pathname = path;

      try {
        window.history.replaceState(
          window.history.state || {},
          "",
          url.toString()
        );
      } catch (error) {
        console.error("URL update failed:", error);
      }
    }
  }

  handlePopState(event) {
    const path = window.location.pathname;

    if (this.routes.has(path)) {
      const route = this.routes.get(path);
      this.executeRoute(path, route);
      this.currentRoute = path;
    } else {
      console.warn(`Unknown route: ${path}`);
    }
  }

  handleLoad() {
    const path = window.location.pathname;

    if (this.routes.has(path)) {
      const route = this.routes.get(path);
      this.executeRoute(path, route);
      this.currentRoute = path;
    } else {
      console.warn(`No route found for: ${path}`);
    }
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getRouteParams() {
    if (!this.currentRoute) return {};

    const route = this.routes.get(this.currentRoute);

    return route ? route.params : {};
  }

  setRouteParams(params) {
    if (!this.currentRoute) return false;

    const route = this.routes.get(this.currentRoute);
    if (route) {
      route.params = { ...route.params, ...params };
      return true;
    }

    return false;
  }

  goBack() {
    if (this.history.length > 1) {
      const previousRoute = this.history[this.history.length - 2];
      this.navigate(previousRoute.path, { replace: true });
      return true;
    }

    window.history.back();
    return false;
  }

  goForward() {
    window.history.forward();
    return true;
  }

  getRoutes() {
    return this.routes;
  }

  hasRoute(path) {
    if (!path) return false;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return this.routes.has(normalizedPath);
  }

  clearRoutes() {
    this.routes.clear();
    this.currentRoute = null;
    this.history = [];
  }

  getHistory() {
    return this.history;
  }

  navigateToCurrent() {
    if (this.currentRoute) {
      return this.navigate(this.currentRoute);
    }
    return false;
  }
}

const router = new Router();

export default router;
