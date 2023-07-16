import { BaseResponse, request } from '../../utils/request';

export function createPost(data: any) {
    return request<BaseResponse<any>>({
        url: 'post/create',
        method: 'post',
        data
    });
}

export function createComment(data: any) {
    return request<BaseResponse<any>>({
        url: 'comment/create',
        method: 'post',
        data
    });
}

export function listPost(lessonId: number) {
    return request<BaseResponse<any>>({
        url: `post/lesson/list/${lessonId}`,
        method: 'get'
    });
}
export function deleteComment(commentId: number) {
    return request<BaseResponse<any>>({
        url: `comment/delete/${commentId}`,
        method: 'delete'
    });
}
export function listComment(data: API.ListCommentInput) {
    return request<BaseResponse<API.ListCommentOutput>>({
        url: 'comment/list',
        method: 'post',
        data
    });
}
