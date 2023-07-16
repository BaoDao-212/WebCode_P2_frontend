import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { createRouterGuards } from './route-guard';
import { whiteNameList } from './contant';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/course/create',
                    name: 'Create Course',
                    component: () => import('@/views/professor/course/CreateCourse.vue')
                },
                {
                    path: '/course/professor/list',
                    name: 'List Course',
                    component: () => import('@/views/professor/course/ListCourse.vue')
                },
                {
                    path: '/student/manager',
                    name: 'Management Student',
                    component: () => import('@/views/professor/student/StudentManagement.vue')
                },
                {
                    path: '/student/course/list',
                    name: 'List Course Student',
                    component: () => import('@/views/student/course/ListCourse.vue')
                },
                {
                    path: '/course/detail/:id',
                    name: 'Detail Course',
                    component: () => import('@/views/professor/course/DetailCourse.vue')
                },
                {
                    path: '/courseStudent/detail/:id',
                    name: 'Detail Course Student',
                    component: () => import('@/views/student/course/DetailCourse.vue')
                },
                {
                    path: '/course/owner/list',
                    name: 'Owner Course Student',
                    component: () => import('@/views/student/course/MyCourses.vue')
                },
                {
                    path: '/course/post/list/:id',
                    name: 'List Post Course',
                    component: () => import('@/views/post/ListPostCourse.vue')
                },
                {
                    path: '/lesson/create/:id',
                    name: 'Create Lesson',
                    component: () => import('@/views/professor/lesson/createLesson.vue')
                },
                {
                    path: '/lesson/post/list/:id',
                    name: 'List Post',
                    component: () => import('@/views/post/ListPost.vue')
                },
                {
                    path: '/lesson/detail/:id',
                    name: 'Detail Lesson',
                    component: () => import('@/views/professor/lesson/detailLesson.vue')
                },
                {
                    path: '/admin/professor/list',
                    name: 'Professor Managerment',
                    component: () => import('@/views/admin/ProfessorManagerment.vue')
                },
                {
                    path: '/admin/course/list',
                    name: 'Course Managerment',
                    component: () => import('@/views/admin/CourseManagement.vue')
                },
                {
                    path: '/admin/student/list',
                    name: 'Student Managerment',
                    component: () => import('@/views/admin/StudentManagement.vue')
                },
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/change-password',
                    name: 'Change Password',
                    component: () => import('@/views/account/change-password.vue')
                },
                {
                    path: '/details',
                    name: 'Detail Profile',
                    component: () => import('@/views/account/detail-profile.vue')
                },
                {
                    path: '/update',
                    name: 'Update Profile',
                    component: () => import('@/views/account/update-profile.vue')
                }
            ]
        },
        {
            path: '/lesson/code/:id',
            name: 'Code Lesson',
            component: () => import('@/views/student/lesson/CodeLesson.vue')
        },

        {
            path: '/auth/login',
            name: 'Login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'Register',
            component: () => import('@/views/pages/auth/register.vue')
        },
        {
            path: '/auth/forgot-password',
            name: 'Forgot Password',
            component: () => import('@/views/pages/auth/ForgotPassword.vue')
        },
        {
            path: '/landing',
            name: 'Landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        }
    ]
});
createRouterGuards(router, whiteNameList);
export default router;
