import { BaseResponse, request } from '@/utils/request';

export function runCode(data: API.RunCodeInput) {
    return request<BaseResponse<API.RunCodeOutput>>({
        url: 'compiler/run',
        method: 'post',
        data
    });
}
