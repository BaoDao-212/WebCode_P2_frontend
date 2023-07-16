<script>
import { updateAccountInfo } from '@/api/account';
import { defineComponent, reactive } from 'vue';
import Storage from '../../utils/Storage';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'Update Profile',
    props: {
        visible: {
            type: Boolean,
            require: true
        }
    },
    setup() {
        const userData = Storage.get('INFO_ACCOUNT', null);
        const state = reactive({
            loading: false,
            formInline: {
                newName: userData.name,
                newEmail: userData.email,
                newPhone: userData.phone
            }
        });
        const toast = useToast();
        const router = useRouter();
        const changeInfo = async () => {
            try {
                const { newName, newEmail, newPhone } = state.formInline;
                if (newName.trim() == '' || newEmail.trim() == '' || newPhone.trim() == '') {
                    return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'All input cannot be empty!' });
                }
                toast.add({ severity: 'info', summary: 'Info Message', detail: 'Changing in...' });
                state.loading = true;
                const err = await updateAccountInfo(state.formInline);
                // console.log(err);
                if (!err.ok) {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: err.error.message });
                } else {
                    userData.name = newName;
                    userData.email = newEmail;
                    userData.phone = newPhone;
                    Storage.set('INFO_ACCOUNT', userData);
                    // router.push('/');
                    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Change Profile successful!' });
                }
                state.loading = false;
            } catch (error) {
                console.log(error);
            }
        };
        return {
            userData,
            changeInfo,
            state,
            toast,
            router
        };
    }
});
</script>
<template>
    <div id="profile-container">
        <div id="info-container">
            <p style="font-size: 28px; font-weight: bold; padding-left: 16px; margin: 16px 0">Thay đổi thông tin cá nhân</p>
            <div class="profile-prop">
                <div class="profile-item1">Tên</div>
                <div class="profile-item2">
                    <input type="text" v-model="state.formInline.newName" />
                </div>
            </div>
            <div class="profile-prop">
                <div class="profile-item1">Email</div>
                <div class="profile-item2">
                    <input type="text" v-model="state.formInline.newEmail" />
                </div>
            </div>
            <div class="profile-prop">
                <div class="profile-item1">Số điện thoại</div>
                <div class="profile-item2">
                    <input type="text" v-model="state.formInline.newPhone" />
                </div>
            </div>
            <div class="profile-prop">
                <div class="profile-item1">Vai trò</div>
                <div class="profile-item2">
                    <input type="text" disabled v-model="userData.position" style="background-color: #eee; cursor: not-allowed" />
                </div>
            </div>
            <div class="profile-prop">
                <div class="profile-item1">Thuộc</div>
                <div class="profile-item2">
                    <input type="text" disabled v-model="userData.department" style="background-color: #eee; cursor: not-allowed" />
                </div>
            </div>
            <div style="display: flex; margin-top: 20px; margin-left: 180px">
                <button @click="router.push('/')" style="width: 80px; height: 30px; border: 1px solid #bebcbc; border-radius: 4px; cursor: pointer; margin-right: 12px">Cancel</button>
                <button @click="changeInfo" style="width: 80px; height: 30px; background-color: #22c55e; color: #fff; border: 1px solid #22c55e; border-radius: 4px; cursor: pointer">Save</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
#profile-container {
    height: 630px;
    background-color: #fff;
    padding: 32px;
    display: flex;
    align-items: center;
}

#info-container {
    width: 100%;
    height: auto;
    padding: 24px;
    border: 1px solid #cecaca;
    border-radius: 4px;
}

.profile-prop {
    height: 60px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
}

.profile-item1 {
    min-width: 120px;
}

.profile-item2 input {
    min-width: 300px;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

.profile-item2 input:focus {
    outline: unset;
    border-color: #66afe9;
}

.line {
    height: 1px;
    border: 1px solid #cecaca;
    margin: 0 16px;
}
</style>
