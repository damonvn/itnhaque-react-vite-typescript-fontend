import axiosClient from "axios";
import { Mutex } from "async-mutex";
import { IBackendRes } from "@/types/backend";
import { notification } from "antd";

interface AccessTokenResponse {
    access_token: string;
}

/**
 * Creates an initial 'axios' instance with custom settings.
 */
const instance = axiosClient.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true
});

const mutex = new Mutex();
const NO_RETRY_HEADER = 'no-retry';

const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        const res = (await instance.get<IBackendRes<AccessTokenResponse>>('/api/v1/auth/refresh')).data;
        if (res && res.data) return res.data.access_token;
        else return null;
    });
};

instance.interceptors.request.use(function (config) {
    const excludedUrls = ['/api/v1/auth/refresh', '/api/v1/auth/login'];

    if (excludedUrls.includes(config.url || '')) {
        // Không thêm Authorization header cho các request đến '/api/v1/auth/refresh' và '/api/v1/auth/login'
        config.headers.Authorization = '';  // Hoặc bạn có thể bỏ qua việc thiết lập header này
    } else {
        // Thêm Authorization header nếu có token
        if (typeof window !== "undefined" && window.localStorage && window.localStorage.getItem('access_token')) {
            config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
        }
    }

    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
});

/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
instance.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.config && error.response
            && +error.response.status === 401
            && error.config.url !== '/api/v1/auth/login'
            && !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = 'true'
            if (access_token) {
                error.config.headers['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('access_token', access_token)
                return instance.request(error.config);
            }
        }

        if (
            error.config && error.response
            && +error.response.status === 400
            && error.config.url === '/api/v1/auth/refresh'
            && (location.pathname.startsWith("/admin") || location.pathname.startsWith("/course-manage"))
        ) {
            const errorMessage = error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng login.";
            notification.error({
                message: errorMessage,
            })
            window.location.href = '/login';
        }
        return error?.response?.data ?? Promise.reject(error);
    }
);

export default instance;