<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            {
                label: 'Access Denied',
                icon: 'pi pi-fw pi-lock',
                to: '/auth/access'
            }
        ]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Course',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'List Course',
                        icon: 'pi pi-fw pi-sign-in',
                        to: 'student/course/list'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    }
                ]
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Timeline',
                icon: 'pi pi-fw pi-calendar',
                to: '/pages/timeline'
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
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
