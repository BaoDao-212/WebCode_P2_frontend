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
    description: '',
    language: '',
    numberLesson: 0,
    time: 0
});
const postCourse = async () => {
    if (!formInline.name || !formInline.description) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter name and desciption of the course' });
    if (formInline.time == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please enter estimated total time for the course' });
    if (formInline.numberLesson == 0) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select number lesson of the course' });
    if (!formInline.language) return toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please select language of the course' });
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Creating in...' });
    const res = await createCourse(formInline);
    formInline.name = '';
    formInline.description = '';
    formInline.language = '';
    formInline.time = 0;
    formInline.numberLesson = 0;
    if (res.ok) return toast.add({ severity: 'info', summary: 'Info Message', detail: 'The course has been created,Please add more lessons for this course' });
    else return toast.add({ severity: 'error', summary: 'Error Message', detail: `${res.error.message}` });
};
</script>

<template>
    <div class="col-12">
        <div class="card">
            <Toast />
            <h1 class="text-blue-800">Create Lesson</h1>
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
            <div class="flex flex-row-reverse flex-wrap mt-2">
                <Button label="Post" icon="pi pi-upload" class="p-button-help" @click="postCourse()" />
            </div>
        </div>
    </div>
</template>
<style></style>
