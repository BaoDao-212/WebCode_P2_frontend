import { defineStore } from 'pinia';
import { ACCESS_TOKEN_KEY } from '../utils/enum/enum';
import Storage from '../utils/Storage';
import { login } from '../api/login';
import { getInfo, logout, register, updatePassword } from '../api/account';
import { store } from '.';
import { listCourse, listCourseProfessor } from '../api/course';

interface CourseState {
    listCourseProfessor: API.Course[];
    listCourse: API.Course[];
}
export const useCourseStore = defineStore({
    id: 'Course',
    state: (): CourseState => ({
        listCourseProfessor: [],
        listCourse: []
    }),
    getters: {
        getListCourseProfessor(): API.Course[] {
            return this.listCourseProfessor;
        },
        getListCourse(): API.Course[] {
            return this.listCourse;
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
        },
        async listCourse() {
            try {
                const data = await listCourse();
                this.listCourse = data.course;
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
