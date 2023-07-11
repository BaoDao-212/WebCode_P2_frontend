<script setup>
import { ref, watch, reactive } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import 'vue-highlight-code/dist/style.css';
const { isDarkTheme } = useLayout();
const lineOptions = ref(null);
import { LanguageEnum } from '@/utils/enum/enum';
import { useToast } from 'primevue/usetoast';
import { QuillEditor } from '@vueup/vue-quill';
import { createCourse } from '@/api/course';
import axios from 'axios';
const toast = useToast();
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
const dropdownItems = ref();
dropdownItems.value = [LanguageEnum.Cpp, LanguageEnum.C, LanguageEnum.Java, LanguageEnum.Python];

const formInline = reactive({
    name: '',
    image: '',
    description: '',
    language: '',
    numberLesson: 0,
    time: 0
});
const postCourse = async () => {
    if (image.value) formInline.image = image.value;
    if (!formInline.name || !formInline.description) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter name and desciption of the course' });
    if (formInline.time == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter estimated total time for the course' });
    if (formInline.numberLesson == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select number lesson of the course' });
    if (!formInline.language) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select language of the course' });
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Creating in...' });
    const res = await createCourse(formInline);
    formInline.name = '';
    formInline.image = '';
    formInline.description = '';
    formInline.language = '';
    formInline.time = 0;
    formInline.numberLesson = 0;
    if (res.ok) return toast.add({ severity: 'info', summary: 'Info Message', detail: 'The course has been created,Please add more lessons for this course' });
    else return toast.add({ severity: 'error', summary: 'Error Message', detail: `${res.error.message}` });
};
//cập nhật ảnh đại diện
const file = ref();
const image = ref();
// cập nhật ảnh giao diện
const onSelectedFiles = async (event) => {
    file.value = event.files[event.files.length - 1];
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
const resetAvatar = () => {
    image.value = '';
};
</script>

<template>
    <div class="col-12">
        <div class="card">
            <Toast />
            <h1 class="text-blue-800">Create Course</h1>
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
                            <div v-if="image" class="flex flex-column align-items-center">
                                <img role="presentation" :src="image.fileUrl" width="600" />
                                <Button @click="resetAvatar()" icon="pi pi-times" severity="danger" class="mt-2" rounded outlined></Button>
                            </div>
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
            <div class="flex flex-row-reverse flex-wrap mt-2">
                <Button label="Post" icon="pi pi-upload" class="p-button-help" @click="postCourse()" />
            </div>
        </div>
    </div>
</template>
<style></style>
