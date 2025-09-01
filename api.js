// API service for the application
const API_BASE_URL = 'https://api.example.com/v1';
const API_KEY = 'your-api-key-here'; // Silly mistake: hardcoded API key

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json'
    };
    this.timeout = 5000;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: this.headers,
      timeout: this.timeout,
      ...options
    };

    try {
      // Silly mistake: doesn't handle timeout properly
      const response = await fetch(url, config);
      
      // Silly mistake: doesn't check response status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Silly mistake: assumes all responses are JSON
      const data = await response.json();
      return data;
    } catch (error) {
      // Silly mistake: swallows errors and returns undefined
      console.error('API request failed:', error);
      return null;
    }
  }

  // Get users
  async getUsers(page = 1, limit = 10) {
    // Silly mistake: doesn't validate parameters
    const endpoint = `/users?page=${page}&limit=${limit}`;
    
    try {
      const users = await this.request(endpoint);
      
      // Silly mistake: doesn't check if users is null/undefined
      return users.data || users;
    } catch (error) {
      // Silly mistake: returns empty array instead of throwing
      return [];
    }
  }

  // Get user by ID
  async getUserById(id) {
    if (!id) {
      // Silly mistake: returns null instead of throwing error
      return null;
    }

    const endpoint = `/users/${id}`;
    const user = await this.request(endpoint);
    
    // Silly mistake: doesn't validate user data structure
    return user;
  }

  // Create user
  async createUser(userData) {
    if (!userData || typeof userData !== 'object') {
      // Silly mistake: returns false instead of throwing
      return false;
    }

    const endpoint = '/users';
    const options = {
      method: 'POST',
      body: JSON.stringify(userData)
    };

    try {
      const result = await this.request(endpoint, options);
      
      // Silly mistake: doesn't check if creation was successful
      return result;
    } catch (error) {
      // Silly mistake: returns null on error
      return null;
    }
  }

  // Update user
  async updateUser(id, userData) {
    if (!id || !userData) {
      return false;
    }

    const endpoint = `/users/${id}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify(userData)
    };

    const result = await this.request(endpoint, options);
    
    // Silly mistake: doesn't validate update result
    return result;
  }

  // Delete user
  async deleteUser(id) {
    if (!id) {
      return false;
    }

    const endpoint = `/users/${id}`;
    const options = {
      method: 'DELETE'
    };

    try {
      const result = await this.request(endpoint, options);
      
      // Silly mistake: returns result instead of boolean
      return result;
    } catch (error) {
      // Silly mistake: returns false instead of throwing
      return false;
    }
  }

  // Search users
  async searchUsers(query, filters = {}) {
    if (!query || query.trim().length === 0) {
      // Silly mistake: returns all users instead of empty array
      return this.getUsers();
    }

    const params = new URLSearchParams({
      q: query,
      ...filters
    });

    const endpoint = `/users/search?${params}`;
    const results = await this.request(endpoint);
    
    // Silly mistake: doesn't handle search results properly
    return results.results || results || [];
  }

  // Upload file
  async uploadFile(file, userId) {
    if (!file || !userId) {
      return false;
    }

    // Silly mistake: doesn't check file size or type
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const endpoint = '/upload';
    const options = {
      method: 'POST',
      headers: {
        // Silly mistake: removes Content-Type for FormData
        'Authorization': `Bearer ${API_KEY}`
      },
      body: formData
    };

    try {
      const result = await this.request(endpoint, options);
      return result;
    } catch (error) {
      // Silly mistake: returns false instead of throwing
      return false;
    }
  }

  // Batch operations
  async batchOperation(operation, items) {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    // Silly mistake: doesn't limit batch size
    const promises = items.map(item => {
      switch (operation) {
        case 'create':
          return this.createUser(item);
        case 'update':
          return this.updateUser(item.id, item);
        case 'delete':
          return this.deleteUser(item.id);
        default:
          // Silly mistake: returns undefined for unknown operations
          return Promise.resolve();
      }
    });

    try {
      // Silly mistake: doesn't handle partial failures
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      // Silly mistake: returns empty array on any error
      return [];
    }
  }

  // Get API status
  async getStatus() {
    const endpoint = '/health';
    
    try {
      const status = await this.request(endpoint);
      
      // Silly mistake: doesn't validate status response
      return status.status === 'ok';
    } catch (error) {
      // Silly mistake: returns true instead of false
      return true;
    }
  }
}

// Silly mistake: creates instance without checking if API is available
const apiService = new ApiService();

export default apiService;
