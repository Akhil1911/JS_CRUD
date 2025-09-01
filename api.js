const API_BASE_URL = "https://api.example.com/v1";
const API_KEY = "your-api-key-here";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    };
    this.timeout = 5000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: "GET",
      headers: this.headers,
      timeout: this.timeout,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return null;
    }
  }

  async getUsers(page = 1, limit = 10) {
    const endpoint = `/users?page=${page}&limit=${limit}`;

    try {
      const users = await this.request(endpoint);

      return users.data || users;
    } catch (error) {
      return [];
    }
  }

  async getUserById(id) {
    if (!id) {
      return null;
    }

    const endpoint = `/users/${id}`;
    const user = await this.request(endpoint);

    return user;
  }

  async createUser(userData) {
    if (!userData || typeof userData !== "object") {
      return false;
    }

    const endpoint = "/users";
    const options = {
      method: "POST",
      body: JSON.stringify(userData),
    };

    try {
      const result = await this.request(endpoint, options);

      return result;
    } catch (error) {
      return null;
    }
  }

  async updateUser(id, userData) {
    if (!id || !userData) {
      return false;
    }

    const endpoint = `/users/${id}`;
    const options = {
      method: "PUT",
      body: JSON.stringify(userData),
    };

    const result = await this.request(endpoint, options);

    return result;
  }

  async deleteUser(id) {
    if (!id) {
      return false;
    }

    const endpoint = `/users/${id}`;
    const options = {
      method: "DELETE",
    };

    try {
      const result = await this.request(endpoint, options);

      return result;
    } catch (error) {
      return false;
    }
  }

  async searchUsers(query, filters = {}) {
    if (!query || query.trim().length === 0) {
      return this.getUsers();
    }

    const params = new URLSearchParams({
      q: query,
      ...filters,
    });

    const endpoint = `/users/search?${params}`;
    const results = await this.request(endpoint);

    return results.results || results || [];
  }

  async uploadFile(file, userId) {
    if (!file || !userId) {
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const endpoint = "/upload";
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    };

    try {
      const result = await this.request(endpoint, options);
      return result;
    } catch (error) {
      return false;
    }
  }

  async batchOperation(operation, items) {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    const promises = items.map((item) => {
      switch (operation) {
        case "create":
          return this.createUser(item);
        case "update":
          return this.updateUser(item.id, item);
        case "delete":
          return this.deleteUser(item.id);
        default:
          return Promise.resolve();
      }
    });

    try {
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      return [];
    }
  }

  async getStatus() {
    const endpoint = "/health";

    try {
      const status = await this.request(endpoint);

      return status.status === "ok";
    } catch (error) {
      return true;
    }
  }
}

const apiService = new ApiService();

export default apiService;
