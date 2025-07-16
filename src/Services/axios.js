import axios from "axios";
import { Cookies } from "react-cookie";
import { userLogout, refreshTokens } from "../redux/Authentication/authActions";
const cookies = new Cookies();
const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 500000,
  withCredentials: true,
});

const refreshTokenAPI = async () => {                         // Refresh token api (to gain new access token)
  try {
    const response = await axios.post(
      `${baseURL}/users/auth/update-refresh-access`,
      {},
      { withCredentials: true }
    );
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
};

const performLogout = (dispatch) => {                         // Logout function
  // localStorage.clear();
  dispatch(userLogout());
  window.location.href = "/login";
};

export const setupAxiosInterceptors = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
                                                                  
      if (error.response?.status === 401) {                    // handle 401 with token refresh
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await refreshTokenAPI();   // called refresh token api for new access token

            if (refreshResponse.status === 200) {
              dispatch(refreshTokens({
                accessToken: 'updated_via_cookie',
                refreshToken: 'updated_via_cookie'
              }));

              return axiosInstance(originalRequest);           // retrying failed api again after getting new access token
            } else {
              performLogout(dispatch);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            const refreshStatus = refreshError.response?.status;   
            if (refreshStatus === 401) {                       // Token refresh failed
              performLogout(dispatch);
            }
            return Promise.reject(error);
          }
        } else {
          performLogout(dispatch);                             // Already retried, logout user
          return Promise.reject(error);
        }
      }

      if (error.response?.status === 403) {                    // Handle 403 (Forbidden) - direct logout
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          return axiosInstance(originalRequest);
        }

        performLogout(dispatch);                               // Perform logout for 403
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};
export default axiosInstance;
