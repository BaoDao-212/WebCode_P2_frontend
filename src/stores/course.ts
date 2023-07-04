import { defineStore } from 'pinia';
import { ACCESS_TOKEN_KEY } from '../utils/enum/enum';
import Storage from '../utils/Storage';
import { login } from '../api/login';
import { getInfo, logout, register, updatePassword } from '../api/account';
import { store } from '.';
import { listCourseProfessor } from '../api/course';

interface CourseState {
    listCourseProfessor: API.ListCourseOutput;
}
export const useCourseStore = defineStore({
    id: 'Course',
    state: (): CourseState => ({
        listCourseProfessor: []
    }),
    getters: {
        getListCourseProfessor(): API.ListCourseOutput {
            return this.listCourseProfessor;
        }
    },
    actions: {
        async listCourseProfessor() {
            try {
                const data = await listCourseProfessor();
                // this.listCourseProfessor = data.course;
                return data.course;
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
});

export function useCourseStoreWithOut() {
    return useCourseStore(store);
}
