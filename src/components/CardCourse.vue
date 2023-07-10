<script setup>
import { Delta } from '@vueup/vue-quill';

const props = defineProps({
    course: {
        type: Object,
        require: true
    }
});
const description = new Delta(props.course.description);
const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
</script>
<template>
    <Card style="width: 320px; height: 540px" class="shadow-6 m-4 border-round">
        <template #header>
            <img alt="Avatar" :src="props.course.image.fileUrl" width="320" />
        </template>
        <template #title
            ><div class="ml-3">{{ props.course.name }}</div></template
        >
        <template #subtitle>
            <div class="ml-3">
                <div class="flex flex-row align-items-center">
                    <Avatar icon="pi pi-user" style="background-color: #9c27b0; color: #ffffff" shape="circle" />
                    <div class="mx-3">{{ props.course.professor.user.name }}</div>
                </div>
            </div>
        </template>
        <template #content>
            <div class="ml-3">
                <div class="">Created At: {{ formatDate(props.course.createdAt) }}</div>
                <div>Number Lesson: {{ props.course.numberLesson }}</div>
                <div>Completion Time:{{ props.course.time }}</div>
            </div>
            <QuillEditor v-model:content="description" theme="bubble" readOnly="true" />
        </template>
    </Card>
</template>

<style lang="less">
p {
    max-height: 60px !important;
    overflow-y: hidden;
}
</style>
