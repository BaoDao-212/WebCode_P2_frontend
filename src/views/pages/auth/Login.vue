<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, reactive } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import to from '@/utils/awaitTo';
import { useToast } from 'primevue/usetoast';
import { getInfo } from '@/api/account';
import Storage from '@/utils/Storage';
const { layoutConfig } = useLayout();
const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const state = reactive({
    loading: false,
    formInline: {
        username: '',
        password: ''
    }
});
const handleSubmit = async () => {
    const { username, password } = state.formInline;
    if (username.trim() == '' || password.trim() == '') {
        return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Username or password cannot be empty!' });
    }
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Logging in...' });
    state.loading = true;

    const [err] = await to(userStore.login(state.formInline));
    if (err) {
        toast.add({ severity: 'error', summary: 'Error Message', detail: err });
    } else {
        router.push('/');
        toast.add({ severity: 'info', summary: 'Info Message', detail: 'Login successful!' });
    }
    state.loading = false;
};

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
const callback = async (response) => {
    // This callback will be triggered when the user selects or login to
    // his Google account from the popup
    console.log('Handle the response', response);
    console.log(response.credential);
    userStore.setToken(response.credential);
    const userInfo = await new Promise((resolve) => {
        resolve(getInfo());
    });
    Storage.set('INFO_ACCOUNT', userInfo?.user);
    router.push('/');
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Login successful!' });
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <Toast />
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email or Username</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="state.formInline.username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="state.formInline.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

                        <router-link to="/auth/forgot-password">
                            <Button label="Forgot password ?" class="w-full mr-1 justify-content-start" outlined text severity="secondary"></Button>
                        </router-link>
                        <Button label="Sign In" class="w-full p-3 text-xl my-2" @click="handleSubmit()"></Button>
                    </div>
                    <div class="flex justify-content-center m-1">
                        <router-link to="/auth/register">
                            <Button label="Register" icon="pi pi-user" class="w-full mr-1" style="width: 200px !important; padding: 12px" outlined text raised severity="secondary"></Button>
                        </router-link>
                        <GoogleLogin :callback="callback" prompt auto-login class="ml-1" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
