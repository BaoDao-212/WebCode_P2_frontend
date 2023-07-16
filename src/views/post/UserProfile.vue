<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
import { listpublicUserPost } from '@/api/post';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Error from '../auth/Error.vue';
const { isDarkTheme } = useLayout();
const lineOptions = ref(null);
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
const posts = ref([]);
const info = ref([]);
const route = useRoute();
console.log(route.params.id);
const check = ref(true);
const toast = useToast();
onMounted(async () => {
    const data = await listpublicUserPost({ userId: route.params.id });
    console.log(data);
    if (data.posts.length == 0) {
        check.value = false;
        toast.add({ severity: 'error', summary: 'Vui lòng thử lại sau', detail: 'Chưa có thông tin về người dùng này', life: 3000 });
        return;
    }
    if (data.ok) {
        posts.value = data.posts;
        info.value = data.posts[1].owner;
    }
});
</script>

<template>
    <Toast />
    <div v-if="check">
        <Card style="width: 70em">
            <template #header> </template>
            <template #title>
                <div class="flex flex-column justify-content-center">
                    <Image :src="info.avatar.filrUrl" v-if="info.avatar" alt="Image" width="250" />
                    <Image src="https://www.pngitem.com/pimgs/m/24-248235_user-profile-avatar-login-account-fa-user-circle.png" v-else alt="Image" width="250" />
                    <div class="ml-5">{{ info.name }}</div>
                </div>
            </template>
            <template #content>
                <div class="flex flex-row">
                    <div class="font-medium ml-5">Email: {{ info.email }}</div>
                </div>
            </template>
            <template #footer> </template>
        </Card>
        <div v-for="post in posts" :key="post.content" class="col-12">
            <ViewPost :content="post" />
        </div>
    </div>
    <Error v-else />
</template>
<style lang="scss" scoped>
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/demo/styles/items.scss';
</style>
