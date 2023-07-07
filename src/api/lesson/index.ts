import { BaseResponse, request } from '@/utils/request';

export function createLesson(data: API.CreateLessonInput) {
    return request({
        url: 'lesson/create',
        method: 'post',
        data
    });
}
export function detailLesson(data: number) {
    return request<BaseResponse<API.DetailCourseOutput>>({
        url: `lesson/detail/${data}`,
        method: 'get'
    });
}
