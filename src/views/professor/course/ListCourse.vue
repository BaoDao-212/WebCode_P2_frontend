<script setup>
import { listCourseProfessor, updateCourse } from '@/api/course';
import { ref, onMounted, reactive } from 'vue';

const products = ref(null);

onMounted(async () => {
    const data = await listCourseProfessor();
    products.value = data.course;
});
const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const formatPercent = (v1, v2) => {
    return (100 * v1) / v2;
};
// hiển thị phần hành động của bảng khóa học cho giáo viên
import { useToast } from 'primevue/usetoast';
import { LanguageEnum } from '@/utils/enum/enum';
import { Delta } from '@vueup/vue-quill';
import axios from 'axios';
const toast = useToast();
const visible = ref(false);
//

const dropdownItems = ref();
dropdownItems.value = [LanguageEnum.Cpp, LanguageEnum.C, LanguageEnum.Java, LanguageEnum.Python];

const formInline = reactive({
    courseId: '',
    image: '',
    name: '',
    description: '',
    language: '',
    numberLesson: 0,
    time: 0
});

const update = async () => {
    if (!formInline.name || !formInline.description) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter name and desciption of the course' });
    if (formInline.time == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter estimated total time for the course' });
    if (formInline.numberLesson == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select number lesson of the course' });
    if (!formInline.language) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select language of the course' });
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Updating in...' });
    if (image.value) formInline.image = image.value;
    // hàm update course sẽ thêm vào chỗ này
    const res = await updateCourse(formInline);
    if (res.ok) toast.add({ severity: 'info', summary: 'Info Message', detail: 'Course is updated' }, 2000);
    else toast.add({ severity: 'info', summary: 'Info Message', detail: `${res.error.message}` }, 2000);
    formInline.name = '';
    formInline.description = '';
    formInline.image = '';
    image.value = '';
    formInline.language = '';
    formInline.time = 0;
    formInline.numberLesson = 0;
};
const buttonUpdateClick = (course) => {
    formInline.courseId = course.id;
    formInline.name = course.name;
    formInline.description = new Delta(course.description);
    formInline.language = course.language;
    formInline.time = course.time;
    formInline.image = course.image;
    image.value = course.image;
    formInline.numberLesson = course.numberLesson;
    visible.value = true;
};
const file = ref();
const image = ref();
// cập nhật ảnh giao diện
const onSelectedFiles = async (event) => {
    file.value = event.files[0];
    const formData = new FormData();
    formData.append('file', file.value);
    formData.append('storagePath', 'image');
    const res = await axios.post(import.meta.env.VITE_APP_BASE_API + 'upload/file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    if (res.data.code == 200) {
        image.value = res.data.data.fileReference;
        toast.add({ severity: 'info', summary: 'Info', detail: file.value.name + '  upload thành công', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: file.value.name + ' không thể upload được', life: 3000 });
    }
};
const toggle = (event) => {
    menu.value.toggle(event);
};
const menu = ref();
</script>
<template>
    <DataTable :value="products" dataKey="id" responsiveLayout="scroll">
        <Column field="id" header="ID" :sortable="true">
            <template #body="slotProps">
                {{ slotProps.data.id }}
            </template>
        </Column>
        <Column field="name" header="Created at" :sortable="true">
            <template #body="slotProps">
                {{ formatDate(slotProps.data.createdAt) }}
            </template>
        </Column>
        <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
                {{ slotProps.data.name }}
            </template>
        </Column>
        <Column field="name" header="Language" :sortable="true">
            <template #body="slotProps">
                {{ slotProps.data.language }}
            </template>
        </Column>
        <Column field="lesson" header="Lesson" :showFilterMatchModes="false" style="min-width: 12rem">
            <template #body="{ data }">
                <ProgressBar :value="formatPercent(data.lessons.length, data.numberLesson)" :showValue="false" style="height: 1rem"></ProgressBar>
            </template>
        </Column>
        <Column field="action" header="Action" :showFilterMatchModes="false" style="min-width: 13rem" class="">
            <template #body="slotProps">
                <div>
                    <div class="flex flex-row">
                        <router-link :to="`/course/detail/${slotProps.data.id}`">
                            <Button icon="pi pi-list" class="mr-1" label="Detail" raised outlined/>
                        </router-link>
                        <Button class="pi pi-file-edit" label="Update" @click="buttonUpdateClick(slotProps.data)" outlined/>
                    </div>
                    <Dialog v-model:visible="visible" modal header="Header" :style="{ width: '60vw' }">
                        <div class="col-12">
                            <div class="card">
                                <Toast />
                                <h1 class="text-blue-800">Update Course</h1>
                                <div class="p-fluid formgrid grid">
                                    <div class="col-12">
                                        <label for="avatar">Avatar</label>
                                        <FileUpload
                                            class="justify-content-center flex flex-row align-items-center"
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
                                                <img v-if="image" role="presentation" :src="image.fileUrl" width="200" />
                                            </template>
                                        </FileUpload>
                                    </div>

                                    <div class="field col-12 md:col-6">
                                        <label for="Name">The name of the course</label>
                                        <InputText id="Name" type="text" class="py-3" placeholder="Example: Java Object Oriented Programming" v-model="formInline.name" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="state">Language of the course</label>
                                        <Dropdown id="state" v-model="formInline.language" class="py-1" :options="dropdownItems" placeholder="Select One"></Dropdown>
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="Name">Total lesson of the course</label>
                                        <InputNumber v-model="formInline.numberLesson" class="m-2" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="100" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="Name">Total time of the course</label>
                                        <InputNumber v-model="formInline.time" class="m-2" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="100" />
                                    </div>
                                    <div class="field col-12 mb-8">
                                        <label for="description">Description</label>
                                        <QuillEditor v-model:content="formInline.description" :modules="full" toolbar="none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" text />
                            <Button label="Yes" icon="pi pi-check" @click="update(data)" autofocus />
                        </template>
                    </Dialog>
                </div>
            </template>
        </Column>
    </DataTable>
</template>
