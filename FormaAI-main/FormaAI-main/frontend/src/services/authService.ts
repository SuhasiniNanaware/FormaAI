import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
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
    const response = await API.post("/register", data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await API.post("/login", data);
    return response.data;
  },
};