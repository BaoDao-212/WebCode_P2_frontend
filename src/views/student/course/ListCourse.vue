<script setup>
import to from '@/utils/awaitTo';
import { useCourseStore } from '@/stores/course';
import { onBeforeMount, ref } from 'vue';
const courseStore = useCourseStore();
const listCourseStudent = ref([]);
const listCourse = ref([]);
onBeforeMount(async () => {
    await courseStore.listCourseOfStudent();
    const data = courseStore.getListCourse;
    const courseStudentId = courseStore.getListCourseStudent.map((cs) => cs.course.id);
    listCourseStudent.value = data.filter((course) => courseStudentId.includes(course.id));
    listCourse.value = data.filter((course) => !courseStudentId.includes(course.id));
    console.log(listCourseStudent.value);
});
</script>
<template>
    <div class="card">
        <h1 class="ml-1">Your course</h1>
        <div class="grid">
            <div v-for="course in listCourseStudent" :key="course">
                <router-link :to="`/courseStudent/detail/${course.id}`">
                    <CardCourse :course="course" class="hover:shadow-8" />
                </router-link>
            </div>
        </div>
    </div>
    <div class="card">
        <h1>Unregistered course</h1>
        <div class="grid">
            <div v-for="course in listCourse" :key="course">
                <router-link :to="`/course/detail/${course.id}`">
                    <CardCourse :course="course" class="hover:shadow-8" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
