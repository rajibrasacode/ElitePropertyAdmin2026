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

// ===================
// RESPONSE INTERCEPTOR (REFRESH LOGIC)
// ===================
const handleResponseError = async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = localStorage.getItem("refreshToken");

            const res = await axios.post(`${BASE_URL}/auth/refresh`, {
                refreshToken,
            });

            const newAccessToken = res.data.accessToken;

            localStorage.setItem("accessToken", newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axios(originalRequest); // retry request
        } catch (err) {
            // refresh token expired (7 days)
            localStorage.clear();
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("refreshToken");

            window.location.href = "/login";
            return Promise.reject(err);
        }
    }

    return Promise.reject(error);
};

api.interceptors.response.use((response) => response, handleResponseError);

privetApi.interceptors.response.use(
    (response) => response,
    handleResponseError,
);
