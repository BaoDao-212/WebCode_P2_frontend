import { BaseResponse, request } from '@/utils/request';

export function createCourse(data: API.CreateCouseInput) {
    return request({
        url: 'course/create',
        method: 'post',
        data
    });
}
export function updateCourse(data: API.UpdateCouseInput) {
    return request({
        url: 'course/update',
        method: 'put',
        data
    });
}
export function listCourseProfessor() {
    return request<BaseResponse<API.ListCourseOutput>>({
        url: 'course/professor/list',
        method: 'get'
    });
}
export function detailCourse(data: number) {
    return request<BaseResponse<API.DetailCourseOutput>>({
        url: `course/detail/${data}`,
        method: 'get'
    });
}
