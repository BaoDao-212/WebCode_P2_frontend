<script setup>
import { listCourse, updateCourse } from '@/api/course';
import { ref, onMounted, reactive } from 'vue';

const products = ref(null);

onMounted(async () => {
    const data = await listCourse();
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
                <ProgressBar :value="formatPercent(data.lessons.length, data.numberLesson)" :showValue="false" style="height: 0.5rem"></ProgressBar>
            </template>
        </Column>
        <Column field="action" header="Action" :showFilterMatchModes="false" style="min-width: 13rem" class="">
            <template #body="{ data }">
                <div>
                    <router-link :to="`/course/detail/${data.id}`">
                        <Button class="mr-1" label="Detail" outlined />
                    </router-link>
                </div>
            </template>
        </Column>
    </DataTable>
</template>
