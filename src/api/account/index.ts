import { BaseResponse, request } from '@/utils/request';

export function updateAccountInfo(data: any) {
    return request<BaseResponse<any>>({
        url: 'account/update',
        method: 'post',
        data
    });
}

export function updatePassword(data: API.ChangePasswordParams) {
    return request({
        url: 'account/change-password',
        method: 'post',
        data
    });
}

export function getInfo() {
    return request<API.UserInfo>({
        url: 'account/info',
        method: 'get'
    });
}

export function logout() {
    return request({
        url: 'account/logout',
        method: 'post'
    });
}
export function register(data: API.RegisterParams) {
    return request({
        url: 'auth/register',
        method: 'post',
        data
    });
}
