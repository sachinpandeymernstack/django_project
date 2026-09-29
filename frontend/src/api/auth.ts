import api from './axios';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerApi = async (payload: RegisterPayload) => {
  const response = await api.post<{ message: string; user: User }>('/auth/register/', payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await api.post<AuthResponse>('/auth/login/', payload);
  return response.data;
};
