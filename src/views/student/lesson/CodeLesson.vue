<script setup>
import { onBeforeMount, ref } from 'vue';
import { detailLessonStudent, updateLessonStudent } from '@/api/lesson';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import CardTheory from '@/components/CardTheory.vue';
import { java } from '@codemirror/lang-java';
import AppConfig from '@/layout/AppConfig.vue';
import AppFooter from '@/layout/AppFooter.vue';
import { oneDark } from '@codemirror/theme-one-dark';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import 'vue-highlight-code/dist/style.css';
import { HighCode } from 'vue-highlight-code';
import { useToast } from 'primevue/usetoast';
import { detailCourseStudent } from '@/api/course';
import { createLessonStudent } from '@/api/lesson';
const route = useRoute();
console.log(route.params.id);
const lessonStudent = ref();
const courseId = ref(null);
const lessonStudents = ref(null);
const products = ref(null);
onBeforeMount(async () => {
    const res = await detailLessonStudent(route.params.id);
    lessonStudent.value = res.lessonStudent;
    code.value = decodeURIComponent(lessonStudent.value.codeCurrent);
    courseId.value = res.lessonStudent.lesson.course.id;
    const res2 = await detailCourseStudent(res.lessonStudent.lesson.course.id);
    lessonStudents.value = res2.course.lessonStudents.sort((a, b) => a.id - b.id);
    const lessonRegisterId = lessonStudents.value.map((ls) => ls.lesson.id);
    if (res2.course.course && res2.course.course.lessons.length > 0)
        if (lessonRegisterId.length != 0) products.value = res2.course.course.lessons.filter((lesson) => !lessonRegisterId.includes(lesson.id));
        else products.value = res2.course.course.lessons;
});
//
onBeforeRouteUpdate(async (to, from, next) => {
    // Làm bất kỳ xử lý cần thiết để cập nhật component tại đây
    if (to.fullPath.split('/')[1] == 'lesson') {
        lessonStudent.value = '';
        code.value = '';
        const res = await detailLessonStudent(to.fullPath.split('/')[3]);
        lessonStudent.value = res.lessonStudent;
        code.value = decodeURIComponent(lessonStudent.value.codeCurrent);
        result.value = '';
        console.log(res);
        const res2 = await detailCourseStudent(courseId.value);
        lessonStudents.value = res2.course.lessonStudents.sort((a, b) => a.id - b.id);
        const lessonRegisterId = lessonStudents.value.map((ls) => ls.lesson.id);
        if (res2.course.course && res2.course.course.lessons.length > 0)
            if (lessonRegisterId.length != 0) products.value = res2.course.course.lessons.filter((lesson) => !lessonRegisterId.includes(lesson.id));
            else products.value = res2.course.course.lessons;
        // Sau khi hoàn thành xử lý, gọi hàm next() để cho phép chuyển đến route mới
    }
    next();
});
// IDE code
const code = ref(`//IDE code`);
const language = 'Java';
// code mirror
const extensions = ref();
if (language == 'Java') {
    extensions.value = [java(), oneDark];
} else if (language == 'Python') {
    extensions.value = [python(), oneDark];
} else if (language == 'Cpp') {
    extensions.value = [cpp(), oneDark];
}
const editorOptions = {
    extraKeys: {
        'Ctrl-Space': 'autocomplete'
    }
};
// hàm đếm số dòng code
const countLines = (text) => {
    const lines = text.split('\n');
    return lines.length * 15;
};
const result = ref(null);
const toast = useToast();
const submitLesson = async () => {
    result.value = '';
    const res = await updateLessonStudent({ codeCurrent: encodeURIComponent(code.value), lessonStudentId: route.params.id });
    result.value = res;
    if (result.value.status == 'Correct') {
        toast.add({ severity: 'info', summary: 'Info Message', detail: 'Your answer correct' });
    } else return toast.add({ severity: 'Error', summary: 'Error Message', detail: 'Your answer wrong' });
};
const nextLesson = async () => {
    const id = lessonStudents.value.findIndex((ls) => ls.id == route.params.id);
    if (id == lessonStudents.value.length - 1) {
        if (!products.value) await registerLesson(products.value[0].id);
        else await router.push(`/courseStudent/detail/${courseId.value}`);
    } else {
        await router.push(`/lesson/code/${lessonStudents.value[id + 1].id}`);
    }
};
const router = useRouter();
const registerLesson = async (lessonId) => {
    const res = await createLessonStudent({ courseStudentId: lessonStudent.value.courseStudent.id, lessonId: lessonId });
    if (res.ok) {
        toast.add({ severity: 'info', summary: 'Info Message', detail: 'Welcome to new lesson' });
        await router.push(`/lesson/code/${res.lessonStudent.id}`);
    } else {
        toast.add({ severity: 'warn', summary: `${res.error.mainReason}`, detail: `${res.error.message}` });
    }
};
</script>
<template>
    <Toast />
    <div>
        <div class="flex flex-row justify-content-between">
            <router-link :to="`/courseStudent/detail/${courseId}`">
                <Button icon="pi pi-backward" outlined rounded class="ml-1 hover:shadow-7"></Button>
            </router-link>
            <div v-if="lessonStudents" class="flex flex-row justify-content-center m-2 overflow-auto">
                <div v-for="(l1, index) in lessonStudents" :key="l1">
                    <router-link :to="`/lesson/code/${l1.id}`">
                        <Avatar v-if="l1.status == 'Correct'" style="background-color: #27b057; color: #ffffff" :label="`${index + 1}`" class="mr-2 border-cyan-500" shape="circle" />
                        <Avatar v-if="l1.status == 'Wrong'" style="background-color: #d73d3d; color: #ffffff" :label="`${index + 1}`" class="mr-2 border-cyan-500" shape="circle" />
                        <Avatar v-if="l1.status == 'New'" style="background-color: #9c9cea; color: #ffffff" :label="`${index + 1}`" class="mr-2 border-cyan-500" shape="circle" />
                    </router-link>
                </div>
                <div v-for="(l1, index) in products" :key="l1">
                    <Avatar :label="`${index + 1 + lessonStudents.length}`" style="background-color: #ffffff" class="mr-2 border-cyan-500" shape="circle" @click="registerLesson(l1.id)" />
                </div>
            </div>
            <div></div>
        </div>
        <div class="grid mt-1 overflow-hidden h-screen">
            <div v-if="lessonStudent && lessonStudent.lesson" class="col-5 overflow-hidden md:overflow-auto surface-overlay h-screen">
                <CardTheory :lesson="lessonStudent.lesson" />
            </div>
            <div class="col-7">
                <Codemirror v-model="code" :style="{ height: '480px' }" :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions" :options="editorOptions" />
                <div class="flex justify-content-end mt-0 mb-2">
                    <div v-if="result">
                        <div v-if="result.status == 'Wrong'" class="text-xl font-bold text-red-700 flex flex-row justify-content-center mt-4">
                            <i class="pi pi-exclamation-triangle mr-2" style="color: rgb(129, 20, 27); font-size: 2rem" /> Incorrect
                        </div>
                        <div v-if="result.status == 'Correct'" class="text-xl font-bold text-primary-500 flex flex-row justify-content-center mt-4"><i class="pi pi-check-circle mr-2" style="color: rgb(39, 21, 156); font-size: 2rem" />Correct</div>
                    </div>
                    <Button icon="pi  pi-upload " label="Submit" class="m-3 h-3 hover:shadow-6" raised @click="submitLesson()" outlined></Button>
                    <Button icon="pi  pi-arrow-circle-right" label="Next" class="m-3 h-3 hover:shadow-6" raised @click="nextLesson()" outlined></Button>
                </div>
                <div class="flex justify-content-end">
                    <div v-if="result" class="card grid h-screen w-screen w-12 overflow-hidden md:overflow-auto surface-overlay">
                        <div class="">
                            <div v-if="result.exitCode == 1" class="text-sm font-semibold text-red-600">
                                <h4>Error</h4>
                                <pre class="pr-3">{{ result.stderr }}</pre>
                                <h4>Error Type</h4>
                                <pre class="text-xl font-bold">{{ result.errorType }}</pre>
                            </div>
                            <div v-else class="text-sm font-semibold text-primary-800">
                                <h4 class="flex justify-content-center">Your Output</h4>
                                <HighCode class="my-1" :codeValue="result.stdout" lang="" theme="light" :copy="false" :textEditor="flase" width="320px" :height="countLines(result.stdout)" :readOnly="true" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <app-footer></app-footer>
    <app-config></app-config>
</template>

<style lang="less" scoped>
.col-7,
.col-5 {
    padding: 0;
}
</style>
