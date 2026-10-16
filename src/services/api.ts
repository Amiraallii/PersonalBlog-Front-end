import axios, { type InternalAxiosRequestConfig } from "axios";

import { env } from "../config/env";
import keycloak from "../auth/keycloak";

type AuthenticatedRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);

      if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
    } catch (error) {
      console.error("Failed to refresh Keycloak token", error);
      keycloak.login();
      return Promise.reject(error);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | AuthenticatedRequestConfig
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!keycloak.authenticated) {
          throw new Error("User is not authenticated.");
        }

        await keycloak.updateToken(-1);

        if (keycloak.token) {
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
        }

        return api(originalRequest);
      } catch (authError) {
        await keycloak.login({
          redirectUri: `${window.location.origin}/Login`,
        });

        return Promise.reject(authError);
      }
    }

    return Promise.reject(error);
  },
);
