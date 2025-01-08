// src/services/axiosConfig.js
import axios from "axios";
import { Cookies } from "react-cookie";
const cookies = new Cookies();

const baseURL = import.meta.env.VITE_BASE_URL;

// Create base axios instance without interceptors
const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
});

const getRefreshTokenFromCookies = () => {
  cookies.get("refreshToken");
};

// Initialize refresh token state
let isRefreshing = false;
let refreshSubscribers = [];

// Configure interceptors after store is available
export const setupAxiosInterceptors = (
  getState,
  dispatch,
  refreshTokensAction
) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const state = getState();
      const token = state.auth?.accessToken; // Get token from your auth state

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((error, token) => {
            if (error) {
              reject(error);
            } else {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const state = getState();
        const refreshToken =
          state.auth?.refreshToken || getRefreshTokenFromCookies();

        const response = await axios.put(
          `${baseURL}/users/auth/update-refresh-access`,
          {
            refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // Include refresh token in header
            },
          }
        );

        const tokens = response.data;
        await dispatch(refreshTokensAction(tokens));

        refreshSubscribers.forEach((cb) => cb(null, tokens.accessToken));
        refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${tokens.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        refreshSubscribers.forEach((cb) => cb(error, null));
        refreshSubscribers = [];
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
  );
};

export default axiosInstance;
