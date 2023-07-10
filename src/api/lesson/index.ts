import { BaseResponse, request } from '@/utils/request';

export function createLesson(data: API.CreateLessonInput) {
    return request({
        url: 'lesson/create',
        method: 'post',
        data
    });
}
export function createLessonStudent(data: API.CreateLessonStudentInput) {
    return request<BaseResponse<API.CreateLessonStudentOutput>>({
        url: 'lessonStudent/create',
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
export function listLessonStudent(id: number) {
    return request<BaseResponse<API.LessonStudent[]>>({
        url: `lessonStudent/list/${id}`,
        method: 'get'
    });
}
export function detailLessonStudent(id: number) {
    return request<BaseResponse<API.LessonStudent>>({
        url: `lessonStudent/detail/${id}`,
        method: 'get'
    });
}
export function updateLessonStudent(data: API.UpdateLessonStudentInput) {
    return request<BaseResponse<API.LessonStudent>>({
        url: `lessonStudent/change`,
        method: 'post',
        data
    });
}
