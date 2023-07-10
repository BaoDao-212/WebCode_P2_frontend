<script setup>
import { ref, onBeforeMount } from 'vue';
import { Delta, QuillEditor } from '@vueup/vue-quill';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import 'vue-highlight-code/dist/style.css';
import { HighCode } from 'vue-highlight-code';
import 'vue-highlight-code/dist/style.css';
const renderContent = ref([]);
const desciptionLesson = ref();
const professor = ref();
const input = ref();
const answer = ref();
const exercise = ref(null);
const showData = ref(false);
const course = ref();
const props = defineProps({
    lesson: {
        type: Object,
        require: true
    }
});
console.log(props.lesson);
onBeforeMount(async () => {
    renderContent.value = props.lesson.theory;
    desciptionLesson.value = props.lesson.description;
    exercise.value = new Delta(JSON.parse(props.lesson.exercise));
    console.log(props.lesson.exercise);
    answer.value = decodeURIComponent(props.lesson.answer);
    input.value = decodeURIComponent(props.lesson.input);
    course.value = props.lesson.course;
    professor.value = props.lesson.course.professor;
    renderContent.value.forEach(async (lesson) => {
        if (lesson.type == 'Code') {
            lesson.value = await decodeURIComponent(lesson.value);
        } else if (lesson.type == 'Text') {
            console.log(lesson.value);
            lesson.content = new Delta(lesson.content);
        }
    });
    showData.value = true;
});
// IDE code
const language = 'Java';
const extensions = ref();
if (language == 'Java') {
    extensions.value = [java(), oneDark];
} else if (language == 'Python') {
    extensions.value = [python(), oneDark];
} else if (language == 'Cpp') {
    extensions.value = [cpp(), oneDark];
}

// hàm đếm số dòng code
const countLines = (text) => {
    const lines = text.split('\n');
    return lines.length * 15;
};
</script>

<template>
    <Toast />
    <div class="card" v-if="showData">
        <div class="p-fluid formgrid grid">
            <div class="flex flex-column">
                <div class="card">
                    <div class="text-6xl font-bold my-3">Exercise</div>
                    <div>
                        <QuillEditor v-model:content="exercise" theme="bubble" readOnly="true" />
                    </div>
                    <div class="flex flex-row justify-content-between">
                        <div v-if="input" class="flex flex-column">
                            <div class="font-bold text-2xl">Input Test</div>
                            <HighCode class="code my-1" :codeValue="input" lang="" theme="light" copy="false" textEditor="true" width="300px" :height="countLines(input)" />
                        </div>
                        <div v-if="answer" class="flex flex-column">
                            <div class="font-bold text-2xl">Answer Test</div>
                            <HighCode class="code my-1" :codeValue="answer" lang="" theme="light" copy="false" textEditor="true" width="300px" :height="countLines(answer)" />
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="text-6xl font-bold my-3">Theory</div>
                    <div v-for="content in renderContent" :key="content">
                        <QuillEditor v-if="content.type == 'Text'" v-model:content="content.content" theme="bubble" readOnly="true" />
                        <HighCode v-if="content.type == 'Code'" class="code my-1" :codeValue="content.content" :theme="dark" :lang="language" codeLines="true" textEditor="true" width="400px" :height="countLines(content.content)" />
                        <div v-if="content.type == 'Media'">
                            <div v-for="file of content.content" :key="file" class="m-0 flex flex-column align-items-start">
                                <img v-if="file.filePath.includes('.webp')" role="presentation" :src="file.fileUrl" width="300" />
                                <video v-else-if="file.filePath.includes('.mp4')" :src="file.fileUrl" player="mp4" controls="true" width="300" />
                                <audio v-else-if="file.filePath.includes('.mp3')" :src="file.fileUrl" controls="true" width="300" />
                                <div v-else-if="file.filePath.includes('.docx') || file.filePath.includes('.pdf') || file.filePath.includes('.pptx')">
                                    <Button label="Link" link>{{ file.fileUrl }}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
.ql-tooltip,
.ql-hidden {
    height: 0 !important;
}

p {
    overflow-wrap: anywhere !important;
}
</style>
