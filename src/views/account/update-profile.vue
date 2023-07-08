<script>
import { useUserStore } from '@/stores/user';
import { defineComponent, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'ChangePassword',
    props: {
        visible: {
            type: Boolean,
            require: true
        }
    },
    setup() {
        const state = reactive({
            loading: false,
            formInline: {
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }
        });
        const toast = useToast();
        const router = useRouter();
        const changePassword = async () => {
            const userStore = useUserStore();
            const { oldPassword, newPassword, confirmNewPassword } = state.formInline;
            if (oldPassword.trim() == '' || newPassword.trim() == '' || confirmNewPassword.trim() == '') {
                return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'All input cannot be empty!' });
            }
            if (newPassword !== confirmNewPassword) {
                return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter new password match' });
            }
            toast.add({ severity: 'info', summary: 'Info Message', detail: 'Changing in...' });
            state.loading = true;
            const err = await userStore.changePassword(state.formInline);
            console.log(err);
            if (!err.ok) {
                toast.add({ severity: 'error', summary: 'Error Message', detail: err.error.message });
            } else {
                toast.add({ severity: 'info', summary: 'Info Message', detail: 'Change Password successful!' });
            }
            state.loading = false;
        };
        return {
            changePassword,
            state,
            toast,
            router
        };
    }
});
</script>
<template>
    <Toast />
    <!-- <Dialog v-model:visible="visible" maximizable modal header="Change-Password" :style="{ width: '50vw' }"> -->
    <div class="flex flex-column gap-2">
        <label for="oldPassword">Old Password</label>
        <InputText id="oldPassword" type="text" placeholder="Old Password" class="w-full" style="padding: 1rem" v-model="state.formInline.oldPassword" />
    </div>
    <div class="flex flex-column gap-2">
        <label for="newPassword">New Password</label>
        <InputText id="newPassword" type="text" placeholder="New Password" class="w-full" style="padding: 1rem" v-model="state.formInline.newPassword" />
    </div>
    <div class="flex flex-column gap-2">
        <label for="confirmNewPassword">Re-enter new password</label>
        <InputText id="confirmNewPassword" type="text" placeholder="Re-enter new password" class="w-full" style="padding: 1rem" v-model="state.formInline.confirmNewPassword" />
    </div>
    <Button @click="changePassword" class="p-2 m-2" label="Change" severity="success" raised />
    <!-- </Dialog> -->
</template>
