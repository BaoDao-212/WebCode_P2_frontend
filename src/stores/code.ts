import { defineStore } from 'pinia';
import { store } from '.';
import { runCode } from '../api/code';

interface CodeState {}
export const useCodeStore = defineStore({
    id: 'Code',
    state: (): CodeState => ({}),

    actions: {
        async runCode(params: API.RunCodeInput) {
            try {
                const  data  = await runCode(params);
                console.log(data);
                return data;
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
});

export function useCodeStoreWithOut() {
    return useCodeStore(store);
}
