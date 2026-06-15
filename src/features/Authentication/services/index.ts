import { api } from "../../../services/api";
import type { LoginResponse, RegisterResponse } from "../types";

export const AuthService = {
  login: async (data: Record<string, string>): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/api/Auth/Login", data);
    return response.data;
  },

  register: async (data: Record<string, string>): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/api/Auth/Register", data);
    return response.data;
  }
};