<script setup>
import { LanguageEnum } from '@/utils/enum/enum';
import { Delta } from '@vueup/vue-quill';
import { useRoute } from 'vue-router';
import { detailCourse } from '@/api/course';
import { ref, onBeforeMount } from 'vue';
import Storage from '@/utils/Storage';
import { registerCourse } from '@/api/course';
const products = ref(null);
const route = useRoute();
console.log(route.params.id);
const professor = ref();
const description = ref();
const course = ref();
import { useToast } from 'primevue/usetoast';
import { useCourseStore } from '@/stores/course';
const toast = useToast();
onBeforeMount(async () => {
    const data = await detailCourse(route.params.id);
    course.value = data.course;
    products.value = data.course.lessons;
    professor.value = data.course.professor;
    description.value = new Delta(data.course.description);
    console.log(products.value);
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
// const toast = useToast();
//
const position = Storage.get('INFO_ACCOUNT', null).position;
const dropdownItems = ref();
dropdownItems.value = [LanguageEnum.Cpp, LanguageEnum.C, LanguageEnum.Java, LanguageEnum.Python];
// hàm đăng ký khóa học cho sinh viên
const courseStore = useCourseStore();

const registerCourseStudent = async () => {
    const data = await registerCourse({ courseId: course.value.id });
    if (data.ok) toast.add({ severity: 'info', summary: 'Info Message', detail: 'Register course of you complete' });
    else toast.add({ severity: 'error', summary: `${data.error.mainReason}`, detail: `${data.error.message}` });
    await courseStore.listCourseStudent();
};

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
            <div class="flex justify-content-end" v-if="position == 'Student'">
                <Button icon="pi pi-spin pi-plus" width="100" raised severity="success" label="Register" @click="registerCourseStudent()"></Button>
            </div>
        </template>
    </Card>
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
        <Column field="name" header="Description" :sortable="true">
            <template #body="slotProps">
                {{ slotProps.data.description }}
            </template>
        </Column>
        <Column field="name" header="Type" :sortable="true">
            <template #body="slotProps">
                {{ slotProps.data.type ? slotProps.data.type : 'Code' }}
            </template>
        </Column>
        <Column v-if="position == professor" field="action" header="Action" :showFilterMatchModes="false" style="min-width: 13rem" class="">
            <template #body="{ data }">
                <div class="flex flex-row">
                    <router-link :to="`/lesson/detail/${data.id}`">
                        <Button class="mr-1" label="Detail" outlined />
                    </router-link>
                </div>
            </template>
        </Column>
    </DataTable>
</template>
