<script setup>
import { onMounted, ref, watch } from 'vue';

import CreatePost from '@/components/CreatePost.vue';
import ViewPost from '@/components/post/ViewPost.vue';
import { listPostCourse } from '@/api/post';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
import { useRoute } from 'vue-router';
const { isDarkTheme } = useLayout();
const route = useRoute();
console.log(route.params.id);
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
onMounted(async () => {
    const data = await listPostCourse(route.params.id);
    console.log(data);
    if (data.ok) {
        posts.value = data.posts;
    }
    console.log(posts.value);
});
const visable = ref(false);
const first = ref(0);
</script>

<template>
    <Button icon="pi pi-comment" outlined text raised label="Create Post" class="mb-3" @click="visable = !visable"></Button>
    <Dialog v-model:visible="visable" maximizable modal header="Create Post" :style="{ width: '80vw' }">
        <CreatePost :lessonId="route.params.id" />
    </Dialog>
    <div v-if="posts.length > 0" class="card">
        <div v-for="post in posts.slice(first, first + 6)" :key="post.content" class="col-12">
            <ViewPost :content="post" />
        </div>
        <Paginator v-model:first="first" :rows="6" :totalRecords="posts.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
    </div>
    <div v-else>
        <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
            <span class="text-blue-500 font-bold text-5xl">Empty</span>
            <h1 class="text-900 font-bold text-3xl lg:text-3xl mb-2">Not posts yet</h1>
            <div class="text-600 mb-5 text-3xl lg:text-3xl">Be the first to post.</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/demo/styles/items.scss';
</style>
