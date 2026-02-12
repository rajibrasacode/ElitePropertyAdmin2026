import axios, { InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:4000";

// ===================
// PUBLIC API
// ===================
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================
// PRIVATE API
// ===================
export const privetApi = axios.create({
  baseURL: BASE_URL,
});

// ===================
// REQUEST INTERCEPTOR
// ===================
const attachToken = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // let browser set multipart boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
};

api.interceptors.request.use(attachToken, Promise.reject);
privetApi.interceptors.request.use(attachToken, Promise.reject);

// RESPONSE INTERCEPTOR
const handleResponseError = async (error: any) => {
  const originalRequest = error.config;

  // Do not intercept login errors
  if (originalRequest.url?.includes("/auth/login")) {
    return Promise.reject(error);
  }

  if (error.response?.status === 401) {
    // token invalid or expired
    localStorage.clear();
    window.location.href = "/login";
  }

  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, handleResponseError);

privetApi.interceptors.response.use(
  (response) => response,
  handleResponseError,
);
