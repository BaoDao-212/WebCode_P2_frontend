<script setup>
import { ref, reactive, defineEmits } from 'vue';
import 'vue-highlight-code/dist/style.css';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { createComment } from '@/api/post';

const props = defineProps({
    postId: {
        type: Number,
        require: true
    }
});

const toast = useToast();
const totalSize = ref(0);
const files = ref([]);
const fileUploader = ref([]);
const uploadedFile = ref([]);
const checkUploadFile = ref(true);
const onSelectedFiles = (event) => {
    files.value = event.files.filter((f) => {
        if (fileUploader.value.length === 0) {
            return true;
        }
        return !fileUploader.value.includes(f);
    });
    checkUploadFile.value = false;
    console.log(checkUploadFile.value);
    files.value.forEach(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        if (file.type == 'video/mp4') {
            formData.append('storagePath', 'video');
        } else {
            formData.append('storagePath', 'image');
        }
        const res = await axios.post(import.meta.env.VITE_APP_BASE_API + 'upload/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.data.code == 200) {
            uploadedFile.value.push(res.data.data.fileReference);
            formInline.file.push(res.data.data.fileReference);
            fileUploader.value = files.value.filter((f) => f === file);
            files.value = await files.value.filter((f) => f != file);
            toast.add({ severity: 'info', summary: 'Info', detail: file.name + '  upload thành công', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: file.name + ' không thể upload được', life: 3000 });
        }
    });
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
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
// tải bài viết lên
const formInline = reactive({
    postId: props.postId,
    contentComment: '',
    file: []
});
const emit = defineEmits(['update-message']);
const postComment = async () => {
    console.log(files.value);
    if (files.value.length > 0) {
        toast.add({ severity: 'error', summary: 'Info', detail: 'Vui lòng chờ upload ảnh ', life: 3000 });
        return;
    } else {
        console.log(formInline);
        const data = await createComment(formInline);
        if (data.ok) {
            toast.add({ severity: 'info', summary: 'Info', detail: 'Bình luận thành công', life: 3000 });
        }
        console.log(data);
        files.value = [];
        uploadedFile.value = [];
        fileUploader.value = [];
        formInline.contentComment = '';
        formInline.file = [];
        emit('update-message');
    }
};
</script>
<template>
    <div>
        <Toast />
        <FileUpload
            class="col-12 flex flex-row align-items-center"
            chooseIcon="pi pi-upload"
            chooseLabel=" "
            style="width: fit-content"
            mode="advanced"
            name="demo[]"
            :showUploadButton="false"
            :showCancelButton="false"
            @upload="onTemplatedUpload($event)"
            :multiple="true"
            accept=".gif,.jpg,.jpeg"
            :maxFileSize="10000000"
            @select="onSelectedFiles"
        >
            <template #header="{ chooseCallback }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                    <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
                </div>
            </template>
            <template #content>
                <div class="flex flex-row">
                    <Textarea placeholder="Comment" class="col-11.5 opacity-100" v-model="formInline.contentComment" id="content" rows="1"> </Textarea>
                    <Button severity="info" outlined class="mx-1" icon="pi pi-send" @click="postComment()" />
                </div>
                <div v-for="file of uploadedFile" :key="file" class="m-0 flex flex-column surface-border align-items-center">
                    <img v-if="file.filePath.includes('.webp')" role="presentation" :src="file.fileUrl" width="200" />
                    <video v-else :src="file.fileUrl" player="mp4" controls="true" width="200" />
                </div>
            </template>
        </FileUpload>
    </div>
</template>
<style>
.container {
    position: relative;
}

.text-area-container {
    display: flex;
    align-items: center;
}

textarea {
    flex: 1;
}

.inline-button {
    margin-left: 8px;
}
</style>
