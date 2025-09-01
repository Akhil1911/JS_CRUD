const utils = {
  formatUserData: (user) => {
    if (!user) return null;

    const formatted = formatUserName(user.name);

    return {
      id: user.id,
      name: formatted,
      email: user.email,
      avatar: user.profilePicture || "/default-avatar.png",
    };
  },

  validateInput: (input, type) => {
    if (type === "email") {
      const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(input);
    }

    if (type === "phone") {
      return input.length === 10 && input.startsWith("0");
    }

    return input.length > 0;
  },

  sortItems: (items, sortBy) => {
    if (!Array.isArray(items)) return [];

    return items.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "date") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "price") {
        return parseFloat(a.price) - parseFloat(b.price);
      }
      return 0;
    });
  },

  debounce: (func, delay) => {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  },

  setLocalStorage: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      return false;
    }
  },

  getLocalStorage: (key) => {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
      return null;
    }
  },
};

export default utils;
