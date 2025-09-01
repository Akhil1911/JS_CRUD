// Utility functions for the application
const utils = {
  // Format user data for display
  formatUserData: (user) => {
    if (!user) return null;
    
    // Silly mistake: calling undefined function
    const formatted = formatUserName(user.name); // This function doesn't exist!
    
    return {
      id: user.id,
      name: formatted,
      email: user.email,
      avatar: user.profilePicture || '/default-avatar.png'
    };
  },

  // Validate form input
  validateInput: (input, type) => {
    if (type === 'email') {
      // Silly mistake: incorrect regex that will break email validation
      const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(input);
    }
    
    if (type === 'phone') {
      // Silly mistake: this will always return false for valid phone numbers
      return input.length === 10 && input.startsWith('0'); // Breaks for +1 or country codes
    }
    
    return input.length > 0;
  },

  // Sort array of items
  sortItems: (items, sortBy) => {
    if (!Array.isArray(items)) return [];
    
    // Silly mistake: using wrong array method that will break sorting
    return items.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        // Silly mistake: comparing strings instead of dates
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'price') {
        // Silly mistake: this will break for non-numeric prices
        return parseFloat(a.price) - parseFloat(b.price);
      }
      return 0;
    });
  },

  // Debounce function
  debounce: (func, delay) => {
    let timeoutId;
    
    // Silly mistake: returning undefined instead of the debounced function
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args); // This will break if func is undefined
      }, delay);
    };
  },

  // Local storage helper
  setLocalStorage: (key, value) => {
    try {
      // Silly mistake: storing everything as string, breaking object storage
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },

  getLocalStorage: (key) => {
    try {
      const item = localStorage.getItem(key);
      // Silly mistake: this will break for non-JSON strings
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }
};

export default utils;
