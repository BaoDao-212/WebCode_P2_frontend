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
export function listUser() {
    return request({
        url: 'auth/list',
        method: 'get'
    });
}
export function listUserProfessor() {
    return request({
        url: 'auth/list-professor',
        method: 'get'
    });
}
export function listStudent() {
    return request({
        url: 'student/list',
        method: 'get'
    });
}
export function createStudent(data: API.CreateStudentInput) {
    return request({
        url: 'student/create',
        method: 'post',
        data
    });
}
export function createProfessor(data: API.CreateProfessorInput) {
    return request({
        url: 'professor/create',
        method: 'post',
        data
    });
}
export function forgotPassword(data: API.ForgotPasswordInput) {
    return request({
        url: 'auth/forgot-password',
        method: 'post',
        data
    });
}
export function listProfessor() {
    return request({
        url: 'professor/list/admin',
        method: 'get'
    });
}
export function detailStudent(studentId: number) {
    return request({
        url: `student/details-student/${studentId}/admin`,
        method: 'get'
    });
}
export function detailProfessor(professorId: number) {
    return request({
        url: `professor/details-professor/${professorId}/admin`,
        method: 'get'
    });
}
