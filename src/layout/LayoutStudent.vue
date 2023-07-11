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
                label: 'List Course',
                icon: 'pi pi-fw pi-server',
                to: '/student/course/list'
            },
            {
                label: 'My Courses',
                icon: 'pi pi-fw pi-user',
                to: '/course/owner/list'
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
            },
            {
                label: 'Administrator',
                icon: 'pi pi-fw pi-facebook',
                url: 'https://www.facebook.com/profile.php?id=100045038932626'
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
