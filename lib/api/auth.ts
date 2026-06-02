import { api } from "./api";
import { UserProfile } from "./user";

const AUTH_BASE_URL = "/auth";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

async function login({ email, password }: LoginRequest) {
  return await api.post<UserProfile>(`${AUTH_BASE_URL}/login`, {
    email,
    password,
  });
}

async function register({ email, password, name }: RegisterRequest) {
  return await api.post<UserProfile>(`${AUTH_BASE_URL}/register`, {
    email,
    password,
    name,
  });
}

async function logout() {
  return await api.post<boolean>(`${AUTH_BASE_URL}/logout`, {});
}

export const authService = {
  login,
  register,
  logout,
};
