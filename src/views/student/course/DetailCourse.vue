<script setup>
import { LanguageEnum } from '@/utils/enum/enum';
import { Delta } from '@vueup/vue-quill';
import { useRoute, useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import Chart from 'primevue/chart';
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
    data.value = await detailCourseStudent(route.params.id);
    courseStudent.value = data.value.course;
    lessonStudents.value = data.value.course.lessonStudents;
    course.value = data.value.course.course;
    lessonStudents.value = data.value.course.lessonStudents.sort((a, b) => a.id - b.id);
    const lessonRegisterId = lessonStudents.value.map((ls) => ls.lesson.id);
    if (data.value.course.course && data.value.course.course.lessons.length > 0)
        if (lessonRegisterId.length != 0) products.value = data.value.course.course.lessons.filter((lesson) => !lessonRegisterId.includes(lesson.id));
        else products.value = data.value.course.course.lessons;
    professor.value = course.value.professor;
    description.value = new Delta(course.value.description);
    chartData.value = setChartData();
});
const chartData = ref();
const chartOptions = ref({
    cutout: '60%'
});

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);
    const newNone = lessonStudents.value.filter((ls) => ls.status == 'New').length + products.value.length;
    const wrong = lessonStudents.value.filter((ls) => ls.status == 'Wrong').length;
    const correct = lessonStudents.value.filter((ls) => ls.status == 'Correct').length;
    return {
        labels: ['Correct', 'Wrong', 'New/None'],
        datasets: [
            {
                data: [correct, wrong, newNone],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
        ]
    };
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
        router.push(`/lesson/code/${res.lessonStudent.id}`);
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
    <div class="card flex flex-column justify-content-center">
        <div class="flex justify-content-center">
            <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
        </div>
        <h4 class="flex justify-content-center text-primary-600 font-bold">Chart reports your learning progress</h4>
    </div>
    <div class="grid">
        <div class="card h-screen w-screen">
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
