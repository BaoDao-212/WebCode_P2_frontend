<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Course Management',
        icon: 'pi pi-fw pi-briefcase',
        to: '/professor',
        items: [
            {
                label: 'Create Course',
                icon: 'pi pi-fw pi-plus',
                to: '/course/create'
            },
            {
                label: 'List Course',
                icon: 'pi pi-fw pi-list',
                to: '/course/professor/list'
            },
            {
                label: 'Student Management',
                icon: 'pi pi-fw pi-user',
                to: '/student/manager'
            }
        ]
    },
    {
        label: 'Personal Pages',
        items: [
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-bookmark',
                to: '/profile',
                items: [
                    {
                        label: 'Change password',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/change-password'
                    },
                    {
                        label: 'Detail profile',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/details'
                    },
                    {
                        label: 'Update profile',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/update'
                    }
                ]
            }
        ]
    },
    {
        label: 'Source Code',
        icon: 'pi pi-fw pi-code',
        items: [
            {
                label: 'Front-end',
                icon: 'pi pi-fw pi-users',
                url: 'https://github.com/BaoDao-212/WebCode_P2_frontend'
            },
            {
                label: 'Back-end',
                icon: 'pi pi-fw pi-server',
                url: 'https://github.com/BaoDao-212/WebCode_P2'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
