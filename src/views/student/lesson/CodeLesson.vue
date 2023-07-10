<script setup>
import { onBeforeMount, ref } from 'vue';
import { detailLessonStudent, updateLessonStudent } from '@/api/lesson';
import { useRoute, useRouter } from 'vue-router';
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
const course = ref(null);
const lessonStudents = ref(null);
const products = ref(null);
onBeforeMount(async () => {
    const res = await detailLessonStudent(route.params.id);
    lessonStudent.value = res.lessonStudent;
    code.value = lessonStudent.value.codeCurrent;
    console.log(res);
    // courseId.value = res.lessonStudent.lesson.course.id;
    const res2 = await detailCourseStudent(res.lessonStudent.lesson.course.id);
    lessonStudents.value = res2.course.lessonStudents;
    const lessonRegisterId = lessonStudents.value.map((ls) => ls.lesson.id);
    if (course.value && course.value.lessons.length > 0) products.value = course.value.lessons.filter((lesson) => !lessonRegisterId.includes(lesson.id));
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
// const toast = useToast();
const submitLesson = async () => {
    const res = await updateLessonStudent({ codeCurrent: decodeURIComponent(code.value), lessonStudentId: route.params.id });
    result.value = res;
    // if (result.value.status == 'Correct') return toast.add({ severity: 'info', summary: 'Info Message', detail: 'Your answer correct' });
    // else return toast.add({ severity: 'Error', summary: 'Error Message', detail: 'Your answer wrong' });
};
const nextLesson = async () => {
    await router.push(`/lesson/code/1`);
};
const router = useRouter();
const registerLesson = async (lessonId) => {
    console.log(lessonId);
    const res = await createLessonStudent({ courseStudentId: lessonStudent.value.courseStudent.id, lessonId: lessonId });
    if (res.ok) {
        // toast.add({ severity: 'info', summary: 'Info Message', detail: 'Welcome to new lesson' });
        await router.push(`/lesson/code/${res.lessonId}`);
    } else {
        // toast.add({ severity: 'warn', summary: `${res.error.mainReason}`, detail: `${res.error.message}` });
    }
};
</script>
<template>
    <!-- <Toast /> -->
    <div class="flex flex-row justify-content-center">
        <div v-for="(l1, index) in lessonStudents" :key="l1">
            <!-- <router-link :to="`${l1.id}`"> -->
            <router-link to="/">
                <Avatar :label="`${index + 1}`" class="mr-2 border-cyan-500" shape="circle" />
            </router-link>
        </div>
        <div v-for="(l1, index) in products" :key="l1">
            <Avatar :label="`${index + 1 + lessonStudents.length}`" class="mr-2 border-cyan-500" shape="circle" @click="registerLesson(l1.id)" />
        </div>
    </div>
    <div class="grid mt-1 overflow-hidden h-screen">
        <div v-if="lessonStudent && lessonStudent.lesson" class="col-5 overflow-hidden md:overflow-auto surface-overlay h-screen">
            <CardTheory :lesson="lessonStudent.lesson" />
        </div>
        <div class="col-7">
            <Codemirror v-model="code" :style="{ height: '480px' }" :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions" :options="editorOptions" />
            <div class="flex justify-content-end mt-0 mb-2">
                <div v-if="result">
                    <div v-if="result.status == 'Wrong'" class="text-xl font-bold text-red-700 flex flex-row justify-content-center mt-4"><i class="pi pi-exclamation-triangle mr-2" style="color: rgb(129, 20, 27); font-size: 2rem" /> Incorrect</div>
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

    <app-footer></app-footer>
    <app-config></app-config>
</template>

<style lang="less" scoped>
.col-7,
.col-5 {
    padding: 0;
}
</style>
