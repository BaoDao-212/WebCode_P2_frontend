<script setup>
import { useCourseStore } from '@/stores/course';
import { onBeforeMount, ref } from 'vue';
const courseStore = useCourseStore();
const data = ref();
onBeforeMount(async () => {
    data.value = await courseStore.listCourse();
});
</script>
<template>
    <div v-for="course in data" :key="course"><CardCourse :course="course" /></div>
</template>

<style lang="scss" scoped></style>
