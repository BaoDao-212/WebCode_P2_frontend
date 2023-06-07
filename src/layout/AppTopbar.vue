<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import ChangePassword from '../views/account/change-password.vue';
import Dialog from 'primevue/dialog';
const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onLogoutClick = async () => {
    useUserStore().logout();
    router.push('/landing');
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
const visible = ref(false);
const labelModel = ref('');
const menu = ref();
const items = ref([
    {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {}
    },
    {
        label: 'Change Password',
        icon: 'pi pi-fw pi-cog',
        // component: () => import('@/views/account/change-password.vue')
        command: () => {
            visible.value = !visible.value;
            labelModel.value = 'Change Password';
        }
    },
    {
        label: 'Log out',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
            useUserStore().logout();
            router.push('/landing');
        }
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

const save = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>WEBCODE</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>
        <Dialog v-model:visible="visible" maximizable modal :header="labelModel" :style="{ width: '50vw' }">
            <ChangePassword></ChangePassword>
        </Dialog>
        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <Button class="w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #2196f3; color: #ffffff" shape="circle" />
                <div class="flex flex-column align">
                    <span class="font-bold">Amy Elsner</span>
                </div></Button
            >
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
            <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>-->
            <!-- <button @click="onSettingsClick()" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
            <button @click="onLogoutClick()" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button> -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dropdown-item {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
}

.dropdown-item:hover {
    background-color: #f5f5f5;
}
.dropdown .p-dropdown-trigger {
    border: none; /* Xóa border xung quanh dropdown */
    box-shadow: none; /* Xóa shadow xung quanh dropdown */
}
</style>
