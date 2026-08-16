import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await API.post('/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await API.post('/login', data);
    return response.data;
  },

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    const response = await API.get('/me', { headers: { Authorization: token ? `Bearer ${token}` : '' } });
    return response.data;
  },

  async updateProfile(payload: { username?: string; email?: string; bio?: string; avatar?: string }) {
    const token = localStorage.getItem('token');
    const response = await API.put('/me', payload, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
    return response.data;
  }
};
