<script setup>
import { listCourseProfessor } from '@/api/course';
import { ref, onBeforeMount, reactive } from 'vue';

const products = ref(null);

onBeforeMount(async () => {
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
import { useRouter } from 'vue-router';
import { LanguageEnum } from '@/utils/enum/enum';
import { Delta } from '@vueup/vue-quill';

const toast = useToast();
const router = useRouter();
const createLesson = () => {
    console.log('oke');
};

const visible = ref(false);
//
const detail = (data) => {
    console.log(data);
};
const dropdownItems = ref();
dropdownItems.value = [LanguageEnum.Cpp, LanguageEnum.C, LanguageEnum.Java, LanguageEnum.Python];

const formInline = reactive({
    name: '',
    description: '',
    language: '',
    numberLesson: 0,
    time: 0
});

const update = () => {
    if (!formInline.name || !formInline.description) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter name and desciption of the course' });
    if (formInline.time == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter estimated total time for the course' });
    if (formInline.numberLesson == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select number lesson of the course' });
    if (!formInline.language) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select language of the course' });
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Creating in...' });
    // hàm update course sẽ thêm vào chỗ này
    formInline.name = '';
    formInline.description = '';
    formInline.language = '';
    formInline.time = 0;
    formInline.numberLesson = 0;
};
const buttonUpdateClick = (course) => {
    formInline.name = course.name;
    formInline.description = new Delta(course.description);
    formInline.language = course.language;
    formInline.time = course.time;
    formInline.numberLesson = course.numberLesson;
    visible.value = true;
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
                    <router-link :to="`/lesson/create/${data.id}`">
                        <Button class="mr-1" label="New lesson" outlined />
                    </router-link>
                    <Button class="mr-1" label="Detail" outlined @click="detail(data)" />
                    <Button severity="success" label="Update" outlined @click="buttonUpdateClick(data)" />
                    <Dialog v-model:visible="visible" modal header="Header" :style="{ width: '60vw' }">
                        <div class="col-12">
                            <div class="card">
                                <Toast />
                                <h1 class="text-blue-800">Update Course</h1>
                                <div class="p-fluid formgrid grid">
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
                            <Button label="No" icon="pi pi-times" @click="detail(data)" text />
                            <Button label="Yes" icon="pi pi-check" @click="update(data)" autofocus />
                        </template>
                    </Dialog>
                </div>
            </template>
        </Column>
    </DataTable>
</template>
