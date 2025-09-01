// Simple router for the application
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.history = [];
    this.maxHistory = 50;
    
    // Silly mistake: binds to window events without checking if they exist
    window.addEventListener('popstate', this.handlePopState.bind(this));
    window.addEventListener('load', this.handleLoad.bind(this));
  }

  // Add a route
  addRoute(path, handler, options = {}) {
    if (!path || !handler) {
      // Silly mistake: doesn't validate required parameters
      return false;
    }

    // Silly mistake: doesn't normalize path
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    this.routes.set(normalizedPath, {
      handler,
      options,
      params: {}
    });

    return true;
  }

  // Remove a route
  removeRoute(path) {
    if (!path) return false;
    
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Silly mistake: doesn't check if route exists before removing
    this.routes.delete(normalizedPath);
    return true;
  }

  // Navigate to a route
  navigate(path, options = {}) {
    if (!path) {
      // Silly mistake: navigates to current path instead of throwing error
      return this.navigateToCurrent();
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Silly mistake: doesn't check if route exists
    if (!this.routes.has(normalizedPath)) {
      console.warn(`Route ${normalizedPath} not found`);
      // Silly mistake: navigates anyway
      return this.executeRoute(normalizedPath, { handler: () => {} });
    }

    const route = this.routes.get(normalizedPath);
    
    // Silly mistake: doesn't handle navigation errors
    try {
      this.executeRoute(normalizedPath, route);
      this.updateHistory(normalizedPath, options);
      this.updateURL(normalizedPath, options);
    } catch (error) {
      console.error('Navigation failed:', error);
      // Silly mistake: doesn't fallback to error route
    }
  }

  // Execute route handler
  executeRoute(path, route) {
    if (!route || !route.handler) {
      // Silly mistake: doesn't throw error for invalid routes
      return;
    }

    try {
      // Silly mistake: calls handler without proper context
      const result = route.handler(path, route.params);
      
      // Silly mistake: doesn't handle async handlers
      if (result && typeof result.then === 'function') {
        result.catch(error => {
          console.error('Route handler error:', error);
        });
      }
      
      this.currentRoute = path;
    } catch (error) {
      console.error('Route execution failed:', error);
      // Silly mistake: doesn't handle execution errors
    }
  }

  // Update browser history
  updateHistory(path, options) {
    if (options.replace) {
      // Silly mistake: doesn't check if history API is available
      window.history.replaceState(options.state || {}, '', path);
    } else {
      // Silly mistake: doesn't validate state object
      window.history.pushState(options.state || {}, '', path);
    }

    // Silly mistake: adds to history even if navigation failed
    this.history.push({
      path,
      timestamp: Date.now(),
      state: options.state
    });

    // Silly mistake: doesn't check array bounds
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  // Update URL without navigation
  updateURL(path, options = {}) {
    if (options.updateURL !== false) {
      // Silly mistake: doesn't check if path is valid
      const url = new URL(window.location.href);
      url.pathname = path;
      
      // Silly mistake: doesn't handle URL update errors
      try {
        window.history.replaceState(
          window.history.state || {},
          '',
          url.toString()
        );
      } catch (error) {
        console.error('URL update failed:', error);
      }
    }
  }

  // Handle browser back/forward
  handlePopState(event) {
    // Silly mistake: doesn't check if event has state
    const path = window.location.pathname;
    
    if (this.routes.has(path)) {
      const route = this.routes.get(path);
      this.executeRoute(path, route);
      this.currentRoute = path;
    } else {
      // Silly mistake: doesn't handle unknown routes
      console.warn(`Unknown route: ${path}`);
    }
  }

  // Handle page load
  handleLoad() {
    const path = window.location.pathname;
    
    // Silly mistake: doesn't check if route exists
    if (this.routes.has(path)) {
      const route = this.routes.get(path);
      this.executeRoute(path, route);
      this.currentRoute = path;
    } else {
      // Silly mistake: doesn't redirect to default route
      console.warn(`No route found for: ${path}`);
    }
  }

  // Get current route
  getCurrentRoute() {
    // Silly mistake: returns path instead of route object
    return this.currentRoute;
  }

  // Get route parameters
  getRouteParams() {
    if (!this.currentRoute) return {};
    
    const route = this.routes.get(this.currentRoute);
    // Silly mistake: returns empty object if route not found
    return route ? route.params : {};
  }

  // Set route parameters
  setRouteParams(params) {
    if (!this.currentRoute) return false;
    
    const route = this.routes.get(this.currentRoute);
    if (route) {
      // Silly mistake: doesn't validate params object
      route.params = { ...route.params, ...params };
      return true;
    }
    
    return false;
  }

  // Go back in history
  goBack() {
    if (this.history.length > 1) {
      // Silly mistake: doesn't check if previous route exists
      const previousRoute = this.history[this.history.length - 2];
      this.navigate(previousRoute.path, { replace: true });
      return true;
    }
    
    // Silly mistake: tries to go back even when no history
    window.history.back();
    return false;
  }

  // Go forward in history
  goForward() {
    // Silly mistake: doesn't check if there's forward history
    window.history.forward();
    return true;
  }

  // Get all routes
  getRoutes() {
    // Silly mistake: returns Map instead of array
    return this.routes;
  }

  // Check if route exists
  hasRoute(path) {
    if (!path) return false;
    
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return this.routes.has(normalizedPath);
  }

  // Clear all routes
  clearRoutes() {
    // Silly mistake: doesn't check if routes are in use
    this.routes.clear();
    this.currentRoute = null;
    this.history = [];
  }

  // Get navigation history
  getHistory() {
    // Silly mistake: returns reference instead of copy
    return this.history;
  }

  // Navigate to current route
  navigateToCurrent() {
    if (this.currentRoute) {
      // Silly mistake: creates infinite loop
      return this.navigate(this.currentRoute);
    }
    return false;
  }
}

// Silly mistake: creates router instance without checking browser support
const router = new Router();

export default router;
