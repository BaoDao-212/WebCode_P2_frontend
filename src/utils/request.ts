import { Storage } from './Storage';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN_KEY } from './enum/enum';
import { uniqueSlash } from './urlUtils';
export interface RequestOptions {
    permCode?: string;
    isGetDataDirectly?: boolean;
    successMsg?: string;
    errorMsg?: string;
}

const UNKNOWN_ERROR = 'Unknown error, please try again';
// const IS_PROD = ['production', 'prod'].includes(import.meta.env.NODE_ENV);
const baseApiUrl = import.meta.env.VITE_APP_BASE_API;
const service = axios.create({
    // baseURL: baseApiUrl,
    timeout: 6000
});

service.interceptors.request.use(
    (config) => {
        const token = Storage.get(ACCESS_TOKEN_KEY);
        if (token && config.headers) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        const res = response.data;

        // if the custom code is not 200, it is judged as an error.
        if (res.code !== 200) {
            // toast.add({ severity: 'error', summary: 'Error Message', detail: res.message });
            // Message.error(res.message || UNKNOWN_ERROR);

            // Illegal token
            if (res.code === 11001 || res.code === 11002) {
                window.localStorage.clear();
                window.location.reload();
            }

            // throw other
            const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: any };
            error.code = res.code;
            return Promise.reject(error);
        } else {
            return res;
        }
    },
    (error) => {
        const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
        // toast.add({ severity: 'error', summary: 'Error Message', detail: errMsg });
        error.message = errMsg;
        return Promise.reject(error);
    }
);

export type Response<T = any> = {
    code: number;
    message: string;
    data: T;
};

export type BaseResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = async <T = any>(config: AxiosRequestConfig, options: RequestOptions = {}): Promise<T> => {
    try {
        const { successMsg, errorMsg, isGetDataDirectly = true } = options;
        const fullUrl = `${baseApiUrl + config.url}`;

        config.url = uniqueSlash(fullUrl);
        const res = await service.request(config);
        // successMsg && toast.add({ severity: 'success', summary: 'Success Mesage', detail: successMsg });
        // errorMsg && toast.add({ severity: 'error', summary: 'Error Mesage', detail: errorMsg });
        return isGetDataDirectly ? res.data : res;
    } catch (error: any) {
        return Promise.reject(error);
    }
};
