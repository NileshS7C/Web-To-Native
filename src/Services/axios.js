// src/services/axiosConfig.js
import axios from "axios";
import { Cookies } from "react-cookie";
import { userLogout } from "../redux/Authentication/authActions";
import { showError } from "../redux/Error/errorSlice";
const cookies = new Cookies();

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

export const setupAxiosInterceptors = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      try {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        if (error.response?.status === 403 || error.response?.status === 401) {
          dispatch(userLogout());
          cookies.remove("userRole", { path: "/" });
          return Promise.reject(error);
        }
        originalRequest._retry = true;
        return axiosInstance(originalRequest);
      } catch (error) {
        dispatch(
          showError({
            message: "User unauthorized!",
            onClose: "hideError",
          })
        );
        dispatch(userLogout());
        cookies.remove("userRole", { path: "/" });
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
  );
};

export default axiosInstance;
