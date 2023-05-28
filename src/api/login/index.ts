import { BaseResponse, request } from '@/utils/request';

export function login(data: API.LoginParams) {
    return request<BaseResponse<API.LoginResult>>(
        {
            url: 'auth/login',
            method: 'post',
            data
        },
        {
            isGetDataDirectly: false
        }
    );
}
