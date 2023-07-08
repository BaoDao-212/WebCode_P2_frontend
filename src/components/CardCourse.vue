<script setup>
import { Delta } from '@vueup/vue-quill';

const props = defineProps({
    course: {
        type: Object,
        require: true
    }
});
const description = new Delta(props.course.description);
</script>
<template>
    <div>
        <div>{{ props.course.name }}</div>
        <div>{{ props.course.language }}</div>
        <div>{{ props.course.createdAt }}</div>
        <div>{{ props.course.numberLesson }}</div>
        <div>{{ props.course.time }}</div>
        <QuillEditor v-model:content="description" theme="bubble" readOnly="true" />
    </div>
</template>

<style lang="scss" scoped></style>
