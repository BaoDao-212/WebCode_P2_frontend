<script setup>
import { LanguageEnum } from '@/utils/enum/enum';
import { Delta } from '@vueup/vue-quill';
import { useRoute, useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
const products = ref(null);
const route = useRoute();
console.log(route.params.id);
const professor = ref();
const description = ref();
const course = ref();
import { useToast } from 'primevue/usetoast';
import { createLessonStudent } from '@/api/lesson';
import { detailCourseStudent } from '@/api/course';
const toast = useToast();
const data = ref(null);
const lessonStudents = ref(null);
const courseStudent = ref(null);
onBeforeMount(async () => {
    // data.value = await courseStore.getDetailCourse(route.params.id);
    data.value = await detailCourseStudent(route.params.id);
    courseStudent.value = data.value.course;
    lessonStudents.value = data.value.course.lessonStudents;
    const lessonRegisterId = lessonStudents.value.map((ls) => ls.lesson.id);
    products.value = course.value.lessons.filter((lesson) => !lessonRegisterId.includes(lesson.id));
    course.value = data.value.course.course;
    // products.value = course.value.lessons;
    professor.value = course.value.professor;
    description.value = new Delta(course.value.description);
});
const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// hiển thị phần hành động của bảng khóa học cho giáo viên
// đăng ký bài học này
const router = useRouter();
const registerLesson = async (lessonId) => {
    console.log(lessonId);
    const res = await createLessonStudent({ courseStudentId: courseStudent.value.id, lessonId: lessonId });
    if (res.ok) {
        console.log(res.lessonId);
        toast.add({ severity: 'info', summary: 'Info Message', detail: 'Welcome to new lesson' });
        router.push(`/lesson/code/${res.lessonId}`);
    } else {
        toast.add({ severity: 'warn', summary: `${res.error.mainReason}`, detail: `${res.error.message}` });
    }
};
const dropdownItems = ref();
dropdownItems.value = [LanguageEnum.Cpp, LanguageEnum.C, LanguageEnum.Java, LanguageEnum.Python];
// before mount
</script>
<template>
    <Toast />
    <Card v-if="professor" class="mb-4 bg-cyan-700 text-purple-50">
        <template #content>
            <div class="flex flex-column ml-3">
                <div class="flex flex-row">
                    <div class="mr-2 text-xl font-bold">Professor:</div>
                    <p class="flex align-items-center font-medium">{{ professor.user.name }}</p>
                </div>
                <div class="flex flex-row">
                    <div class="mr-2 text-xl font-bold">School/laboratory:</div>
                    <p class="flex align-items-center">{{ professor.academicLevel }}</p>
                </div>
                <div class="flex flex-row">
                    <div class="mr-2 text-xl font-bold">Email:</div>
                    <p class="flex align-items-center">{{ professor.user.email }}</p>
                </div>
                <div class="font-bold text-2xl">{{ course.name }}</div>
            </div>
            <QuillEditor v-model:content="description" theme="bubble" readOnly="true" />
        </template>
    </Card>
    <div class="grid">
        <div class="card h-screen">
            <div class="grid">
                <div v-for="l1 in lessonStudents" :key="l1">
                    <router-link :to="`/lesson/code/${l1.id}`">
                        <CardLessonMini :lesson="l1.lesson" class="border-cyan-500" :status="l1.status" />
                    </router-link>
                </div>
                <div v-for="l1 in products" :key="l1">
                    <CardLessonMini :lesson="l1" @click="registerLesson(l1.id)" class="border-orange-500" status="None" />
                </div>
            </div>
        </div>
    </div>
</template>
