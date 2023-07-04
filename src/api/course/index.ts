import { BaseResponse, request } from '@/utils/request';

export function createCourse(data: API.CreateCouseInput) {
    return request({
        url: 'course/create',
        method: 'post',
        data
    });
}
export function listCourseProfessor() {
    return request<BaseResponse<API.ListCourseOutput>>({
        url: 'course/professor/list',
        method: 'get'
    });
}
