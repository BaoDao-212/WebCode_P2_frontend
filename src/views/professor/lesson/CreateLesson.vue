<script setup>
import { ref, reactive } from 'vue';
import 'vue-highlight-code/dist/style.css';
import { useToast } from 'primevue/usetoast';
import { Delta, QuillEditor } from '@vueup/vue-quill';
const toast = useToast();
import { useRoute } from 'vue-router';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror';
import { HighCode } from 'vue-highlight-code';
import { createLesson } from '@/api/lesson';
import 'vue-highlight-code/dist/style.css';
import axios from 'axios';
const dropdownItems = ref();
dropdownItems.value = ['Text', 'Code', 'Media', 'Exercise', 'Input Test', 'Output Test'];
const quillEditorText = ref();
const option = ref();
const renderContent = ref([]);

const route = useRoute();
console.log(route.params.id);

const render = () => {
    console.log('render');
    if (option.value == 'Text') {
        renderContent.value.push({ type: 'Text', content: new Delta(quillEditorText.value) });
        quillEditorText.value = '';
    } else if (option.value == 'Code') {
        renderContent.value.push({ type: 'Code', content: code.value });
        code.value = '';
    } else if (option.value == 'Media') {
        renderContent.value.push({ type: 'Media', content: uploadedFile.value });
        uploadedFile.value = [];
    } else if (option.value == 'Exercise') {
        renderContent.value.push({ type: 'Exercise', content: quillEditorText.value });
        dropdownItems.value = dropdownItems.value.filter((item) => item != 'Exercise');
        quillEditorText.value = '';
        option.value = '';
    } else if (option.value == 'Input Test') {
        console.log('input');
        renderContent.value.push({ type: 'Input Test', content: code.value });
        dropdownItems.value = dropdownItems.value.filter((item) => item != 'Input Test');
        code.value = '';
        option.value = '';
    } else if (option.value == 'Output Test') {
        renderContent.value.push({ type: 'Output Test', content: code.value });
        dropdownItems.value = dropdownItems.value.filter((item) => item != 'Output Test');
        code.value = '';
        option.value = '';
    }
};
// IDE code
const code = ref(``);
const language = 'Java';
const extensions = ref();
if (language == 'Java') {
    //     code.value += `
    // public class HelloWorld {
    //   public static void main(String[] args) {
    //     System.out.println("Hello, world!");
    //   }
    // }`;
    extensions.value = [java(), oneDark];
} else if (language == 'Python') {
    extensions.value = [python(), oneDark];
} else if (language == 'Cpp') {
    extensions.value = [cpp(), oneDark];
    //     code.value += `
    // #include <iostream>
    // int main() {
    //     std::cout << "Hello, world!" << std::endl;
    //     return 0;
    // }
    // `;
}
const editorOptions = {
    extraKeys: {
        'Ctrl-Space': 'autocomplete'
    }
};

// tải ảnh và video lên
const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const fileUploader = ref([]);
const uploadedFile = ref([]);
const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onSelectedFiles = (event) => {
    files.value = event.files.filter((f) => {
        if (fileUploader.value.length === 0) {
            return true;
        }
        return !fileUploader.value.includes(f);
    });
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};

const uploadEvent = async () => {
    totalSizePercent.value = totalSize.value / 10;
    if (files.value && files.value.length > 0) {
        files.value.forEach(async (file) => {
            console.log(file);
            const formData = new FormData();
            formData.append('file', file);
            if (file.type == 'video/mp4') {
                formData.append('storagePath', 'video');
            } else {
                if (file.type == 'application/pdf') formData.append('storagePath', 'pdf');
                else if (file.type == 'audio/mpeg') formData.append('storagePath', 'mp3');
                else if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') formData.append('storagePath', 'docx');
                else formData.append('storagePath', 'image');
            }
            const res = await axios.post(import.meta.env.VITE_APP_BASE_API + 'upload/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.code == 200) {
                uploadedFile.value.push(res.data.data.fileReference);
                fileUploader.value = files.value.filter((f) => f === file);
                files.value = await files.value.filter((f) => f != file);
                toast.add({ severity: 'info', summary: 'Info', detail: file.name + '  upload thành công', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: file.name + ' không thể upload được', life: 3000 });
            }
        });
    }
};

const onTemplatedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
// hàm đếm số dòng code
const countLines = (text) => {
    const lines = text.split('\n');
    return lines.length * 15;
};
// hàm back lại khai render lesson
const backRender = () => {
    const lastEle = renderContent.value.pop();
    if (lastEle.type == 'Input Test' || lastEle.type == 'Output Test' || lastEle.type == 'Exercise') {
        dropdownItems.value.push(lastEle.type);
    }
};
const formInline = reactive({
    courseId: route.params.id,
    name: '',
    description: '',
    theory: [],
    exercise: '',
    inputString: '',
    answer: ''
});
// hàm tạo tiết học cho khóa học này
const postLesson = async () => {
    renderContent.value.forEach((item) => {
        if (item.type == 'Input Test') {
            formInline.inputString = encodeURIComponent(item.content);
        } else if (item.type == 'Output Test') {
            formInline.answer = encodeURIComponent(item.content);
        } else if (item.type == 'Exercise') {
            formInline.exercise = item.content;
        } else {
            if (item.type == 'Exercise') item.content = encodeURIComponent(item.content);
            formInline.theory.push(item);
        }
    });
    console.log(formInline);
    const res = await createLesson(formInline);
    if (res.ok) toast.add({ severity: 'info', summary: 'Info Message', detail: 'The lesson has been created' }, 2000);
    else toast.add({ severity: 'Error', summary: 'Input error', detail: `${res.data.error.message}` }, 2000);
};
</script>

<template>
    <Toast />
    <div class="flex flex-row">
        <div class="col-12 md:col-6">
            <div class="card">
                <h1 class="text-blue-800">Create Lesson</h1>
                <div class="p-fluid formgrid grid mb-6">
                    <div class="field col-12">
                        <label for="Name">The name of the lesson</label>
                        <InputText id="Name" type="text" class="py-3" placeholder="Example: Class and Object (Part1)" v-model="formInline.name" />
                    </div>
                    <div class="field col-12 mb-6">
                        <label for="state">Description of the lesson</label>
                        <InputText id="Name" type="text" class="py-3" placeholder="Example: Class and Object (Part1)" v-model="formInline.description" />
                    </div>
                    <div class="field col-12">
                        <Dropdown id="state" v-model="option" class="py-1" :options="dropdownItems" placeholder="Select One"></Dropdown>
                        <label for="state" v-if="option == 'Text'">Theory of the lesson</label>
                        <label for="state" v-if="option == 'Exercise'">Exercise of the lesson</label>
                        <div class="h-24rem" v-if="option == 'Text' || option == 'Exercise'">
                            <QuillEditor v-model:content="quillEditorText" :modules="full" toolbar="none" />
                        </div>
                        <Codemirror
                            v-model="code"
                            v-if="option == 'Code' || option == 'Input Test' || option == 'Output Test'"
                            class="mt-5"
                            :style="{ height: '400px' }"
                            :autofocus="true"
                            :indent-with-tab="true"
                            :tab-size="2"
                            :extensions="extensions"
                            :options="editorOptions"
                        />
                        <FileUpload v-if="option == 'Media'" name="demo[]" @upload="onTemplatedUpload($event)" :multiple="true" accept=".gif,.jpg,.jpeg,.png,.mp4,.mp3,.docx,.pptx,.txt,.pdf" :maxFileSize="50000000" @select="onSelectedFiles">
                            <template #header="{ chooseCallback }">
                                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                                    <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
                                    <Button @click="uploadEvent()" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                                    <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
                                        ><span class="white-space-nowrap">{{ totalSize }}B / 100Mb</span></ProgressBar
                                    >
                                </div>
                            </template>
                            <template #content="{ removeFileCallback }">
                                <div v-if="files && files.length > 0">
                                    <h5>Pending</h5>
                                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                        <div v-for="(file, index) of files" :key="file" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                            <div v-if="file.type != 'video/mp4'">
                                                <div v-if="file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'">
                                                    <i class="pi pi-file-word" style="font-size: 2.5rem"></i>
                                                </div>
                                                <div v-else-if="file.type == 'application/pdf'"><i class="pi pi-file-pdf" style="font-size: 2.5rem"></i></div>
                                                <div v-else-if="file.type == 'audio/mpeg'">
                                                    <audio controls autoplay>
                                                        <source :src="file.objectURl" type="audio/mpeg" />
                                                    </audio>
                                                </div>
                                                <img v-else role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                                            </div>
                                            <video v-else-if="file.type == 'video/mp4'" :src="file.objectURl"></video>
                                            <div>{{ formatSize(file.size) }}</div>
                                            <Badge value="Pending" severity="warning" />
                                            <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="uploadedFile.length > 0">
                                    <h5>Completed</h5>
                                    <div class="flex flex-wrap p-0 gap-5">
                                        <div v-for="file of uploadedFile" :key="file" class="card m-0 flex flex-column border-1 surface-border align-items-center">
                                            <img v-if="file.filePath.includes('.webp')" role="presentation" :src="file.fileUrl" width="300" />
                                            <video v-else-if="file.filePath.includes('.mp4')" :src="file.fileUrl" player="mp4" controls="true" width="300" />
                                            <audio v-else-if="file.filePath.includes('.mp3')" :src="file.fileUrl" controls="true" width="300" />
                                            <div v-else-if="file.filePath.includes('.docx') || file.filePath.includes('.pdf') || file.filePath.includes('.pptx')">
                                                <Button label="Link" link>{{ file.fileUrl }}</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template #empty>
                                <div class="flex align-items-center justify-content-center flex-column">
                                    <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                                    <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                                </div>
                            </template>
                        </FileUpload>
                    </div>
                </div>
            </div>
            <div class="flex flex-row-reverse">
                <Button raised icon="pi pi-angle-double-right " label="Next" class="p-button-info mx-2" outlined @click="render" />
                <Button raised icon="pi pi-angle-double-left " label="Back" class="p-button-info" outlined @click="backRender" />
            </div>
        </div>
        <div class="col-12 md:col-6 overflow-y-scroll h-screen">
            <div class="card">
                <h1 class="text-blue-800">Render Lesson</h1>
                <div class="p-fluid formgrid grid">
                    <div class="flex flex-column">
                        <div class="text-6xl font-bold">{{ formInline.name }}</div>
                        <div class="text-2xl font-bold">Description</div>
                        <div class="text-xl font-medium">{{ formInline.description }}</div>
                        <div v-for="content in renderContent" :key="content">
                            <div v-if="content.type == 'Exercise'" class="font-bold text-2xl">Exercise</div>
                            <QuillEditor v-if="content.type == 'Text' || content.type == 'Exercise'" v-model:content="content.content" theme="bubble" readOnly="true" />
                            <HighCode v-if="content.type == 'Code'" class="code my-1" :codeValue="content.content" :theme="dark" :lang="language" codeLines="true" textEditor="true" width="640px" :height="countLines(content.content)" />
                            <div v-if="content.type == 'Input Test'" class="font-bold text-2xl">Input Test</div>
                            <HighCode v-if="content.type == 'Input Test'" class="code my-1" :codeValue="content.content" lang="" theme="light" codeLines="true" textEditor="true" width="500px" :height="countLines(content.content)" />
                            <div v-if="content.type == 'Output Test'" class="font-bold text-2xl">Output Test</div>
                            <HighCode v-if="content.type == 'Output Test'" class="code my-1" :codeValue="content.content" lang="" theme="light" codeLines="true" textEditor="true" width="500px" :height="countLines(content.content)" />
                            <div v-if="content.type == 'Media'">
                                <div v-for="file of content.content" :key="file" class="card m-0 flex flex-column border-1 surface-border align-items-center">
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
                <div class="flex flex-row-reverse flex-wrap mt-2">
                    <Button label="Post" icon="pi pi-upload" class="p-button-help" @click="postLesson()" />
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
