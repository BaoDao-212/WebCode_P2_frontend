import { defineStore } from 'pinia';
import { store } from '.';
import { listCourse, listCourseProfessor, listCourseStudent } from '@/api/course';

export const useCourseStore = defineStore({
    id: 'Course',
    state: () => ({
        listCourseProfessor: [],
        listCourse: [],
        listCourseStudent: []
    }),
    getters: {
        getListCourseProfessor: (state) => state.listCourseProfessor,
        getListCourse: (state) => state.listCourse,
        getListCourseStudent: (state) => state.listCourseStudent,
        getDetailCourse: (state) => {
            return (courseId) => state.listCourse.find((course) => course.id == courseId);
        },
        getDetailCourseStudent: (state) => {
            return (courseId) => state.listCourseStudent.find((cs) => cs.course.id == courseId);
        }
    },
    actions: {
        async listCourseProfessor() {
            try {
                const data = await listCourseProfessor();
                this.listCourseProfessor = data.course;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async listAllCourse() {
            try {
                const data = await listCourse();
                this.listCourse = data.course;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async listCourseOfStudent() {
            try {
                const [listCourseS, listC] = await Promise.all([listCourseStudent(), listCourse()]);
                this.listCourseStudent = listCourseS.course;
                this.listCourse = listC.course;
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
});

export function useCourseStoreWithOut() {
    return useCourseStore(store);
}
