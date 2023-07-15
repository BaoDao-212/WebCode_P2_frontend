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
export function listCourse() {
    return request<BaseResponse<API.ListCourseOutput>>({
        url: 'course/list',
        method: 'get'
    });
}
export function detailCourse(data: number) {
    return request<BaseResponse<API.DetailCourseOutput>>({
        url: `course/detail/${data}`,
        method: 'get'
    });
}
// course student
export function registerCourse(data: API.RegisterCouseInput) {
    return request({
        url: 'courseStudent/create',
        method: 'post',
        data
    });
}

export function listCourseStudent() {
    return request<BaseResponse<API.ListCourseStudentOutput>>({
        url: 'courseStudent/list',
        method: 'get'
    });
}
export function listCourseStudentOfProfessor(studentId: number) {
    return request({
        url: `courseStudent/list-course-student/${studentId}`,
        method: 'get'
    });
}
export function listOverviewNotitiaWeb() {
    return request<BaseResponse<API.ListOverviewNotitiaWebOutput>>({
        url: `course/overview`,
        method: 'get'
    });
}
export function detailCourseStudent(courseId: number) {
    return request<BaseResponse<API.ListCourseStudentOutput>>({
        url: `courseStudent/detail/${courseId}`,
        method: 'get'
    });
}
