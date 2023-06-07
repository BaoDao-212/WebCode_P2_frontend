import { defineStore } from 'pinia';
import { ACCESS_TOKEN_KEY } from '../utils/enum/enum';
import Storage from '../utils/Storage';
import { login } from '../api/login';
import { getInfo, logout, register, updatePassword } from '../api/account';
import { store } from '.';

interface UserState {
    token: string;
    userInfo: Partial<API.UserInfo>;
}
export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        token: Storage.get(ACCESS_TOKEN_KEY, null),
        userInfo: {}
    }),
    getters: {
        getToken(): string {
            return this.token;
        }
    },
    actions: {
        resetToken() {
            this.token = '';
            this.userInfo = {};
            Storage.clear();
            console.log(Storage.get(ACCESS_TOKEN_KEY, null));
        },
        setToken(token: string) {
            this.token = token ?? '';
            const ex = 7 * 24 * 60 * 60 * 1000;
            Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
        },
        async login(params: API.LoginParams) {
            try {
                const { data } = await login(params);
                this.setToken(data.accessToken);
                return this.afterLogin();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async afterLogin() {
            try {
                const userInfo = await new Promise((resolve) => {
                    resolve(getInfo());
                });
                this.userInfo = userInfo;
                return { userInfo };
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async logout() {
            // await logout();
            this.resetToken();
        },
        async register(params: API.RegisterParams) {
            const r = await register(params);
            console.log(r);
            return r;
        },
        async changePassword(params: API.ChangePasswordParams) {
            const r = await updatePassword(params);
            console.log(r);
            return r;
        }
    }
});

export function useUserStoreWithOut() {
    return useUserStore(store);
}
