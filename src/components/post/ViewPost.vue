<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
import CreateComment from '../comment/CreateComment.vue';
import ViewComment from '../comment/ViewComment.vue';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// OR | AND
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import { listComment } from '@/api/post';
import { Delta } from '@vueup/vue-quill';
const { isDarkTheme } = useLayout();

const lineOptions = ref(null);
const showComment = ref(false);
const props = defineProps({
    content: {
        type: Object,
        require: true
    }
});
const comments = ref(props.content.comments);
const updateMessage = async () => {
    const data = await listComment({ postId: props.content.id });
    comments.value = data.comments;
};
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
const images = ref(props.content.file);
const dateUpdate = Date.now() - new Date(props.content.createdAt).getTime();
const days = Math.floor(dateUpdate / (1000 * 60 * 60 * 24));
const remainingTime = dateUpdate % (1000 * 60 * 60 * 24);
const hours = Math.floor(remainingTime / (1000 * 60 * 60));
const remainingTimeMinutes = remainingTime % (1000 * 60 * 60);
const minutes = Math.floor(remainingTimeMinutes / (1000 * 60));
const timeString = `${days} ngày ${hours} giờ ${minutes} phút`;
const content = new Delta(props.content.content.ops);
const onDowload = (content) => {
    console.log(content);
    window.location.href = content;
};
const first = ref(0);
</script>
<template>
    <div class="col-12">
        <Card style="width: 70em">
            <template #header>
                <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 980px">
                    <template #item="slotProps">
                        <img v-if="slotProps.item.filePath.includes('.webp')" role="presentation" :src="slotProps.item.fileUrl" style="width: 100%" preview />
                        <video v-else-if="slotProps.item.filePath.includes('.mp4')" :src="slotProps.item.fileUrl" player="mp4" controls="true" style="width: 100%" />
                        <audio v-else-if="slotProps.item.filePath.includes('.mp3')" :src="slotProps.item.fileUrl" controls="true" width="300" />
                        <div v-else-if="slotProps.item.filePath.includes('.docx') || slotProps.item.filePath.includes('.pdf') || slotProps.item.filePath.includes('.pptx')">
                            <Button label="Link" link @click="onDowload(slotProps.item.fileUrl)">{{ slotProps.item.fileUrl }}</Button>
                        </div>
                    </template>
                    <template #thumbnail="slotProps">
                        <img v-if="slotProps.item.filePath.includes('.webp')" role="presentation" :src="slotProps.item.fileUrl" style="width: 40%" />
                        <video v-else-if="slotProps.item.filePath.includes('.mp4')" role="presentation" :src="slotProps.item.fileUrl" player="mp4" controls="true" style="width: 40%" />
                        <audio v-else-if="slotProps.item.filePath.includes('.mp3')" role="presentation" :src="slotProps.item.fileUrl" controls="true" width="80" />
                        <div v-else-if="slotProps.item.filePath.includes('.docx') || slotProps.item.filePath.includes('.pdf') || slotProps.item.filePath.includes('.pptx')">
                            <Button label="Link" link altKey="true">{{ slotProps.item.fileUrl }}</Button>
                        </div>
                    </template>
                </Galleria>
            </template>
            <template #title>
                <span class="font-bold text-2xl flex justify-content-center text-blue-700">Lesson: {{ props.content.lesson.name }}</span>
                <div class="flex flex-row">
                    <Avatar :src="props.content.owner.avatar" v-if="props.content.owner.avatar" class="mr-2" size="large" shape="circle" />
                    <Avatar :src="props.content.owner.avatar" icon="pi pi-user" v-else class="mr-2" size="large" shape="circle" />
                    <div>
                        <div class="font-bold text-2xl font-light text-blue-700">
                            {{ props.content.owner.name }}
                        </div>

                        <div class="text-xs text-blue-600">{{ timeString }}</div>
                    </div>
                </div>
            </template>
            <template #content>
                <QuillEditor v-model:content="content" theme="bubble" readOnly="true" />
            </template>
            <template #footer>
                <Button @click="showComment = !showComment" icon="pi pi-book" :label="comments.length + ' Comment'" severity="info" text raised rounded style="margin-left: 0.5em" />
                <CreateComment :postId="props.content.id" @update-message="updateMessage" />
                <div v-if="showComment">
                    <Paginator v-if="comments.length > 0" v-model:first="first" :rows="6" :totalRecords="comments.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                    <div v-for="comment in comments.slice(first, first + 6)" :key="comment.owner">
                        <ViewComment :comment="comment" :ownerid="props.content.owner.id" @update-message="updateMessage" />
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>
<style lang="scss" scoped>
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/demo/styles/items.scss';
</style>
