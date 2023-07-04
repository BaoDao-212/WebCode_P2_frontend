import { BaseResponse, request } from '@/utils/request';

export function createLesson(data: API.CreateLessonInput) {
    return request({
        url: 'lesson/create',
        method: 'post',
        data
    });
}
