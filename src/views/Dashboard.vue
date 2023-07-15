<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { listOverviewNotitiaWeb } from '@/api/course';
const { isDarkTheme } = useLayout();
const listCourse = ref(null);
const data = ref(null);
onBeforeMount(async () => {
    const res = await listOverviewNotitiaWeb();
    listCourse.value = res.course;
    data.value = res;
});
const lineOptions = ref(null);
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
const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
</script>

<template>
    <div class="grid" v-if="data">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Student</span>
                        <div class="text-900 font-medium text-xl">{{ data.numberStudent }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-plus text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ data.numberNewStudent }} </span>
                <span class="text-500"> newly registered since last month</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Registered Course</span>
                        <div class="text-900 font-medium text-xl">{{ data.numberCourseStudent }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-book text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ data.numberNewCourseStudent }}</span>
                <span class="text-500"> newly registered since last month</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Lesson</span>
                        <div class="text-900 font-medium text-xl">{{ data.numberLesson }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ data.numberNewLesson }}</span>
                <span class="text-500"> newly created since last month</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Course</span>
                        <div class="text-900 font-medium text-xl">{{ data.numberCourse }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ data.courseStudent.length }}</span>
                <span class="text-500"> responded</span>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>List Course</h5>
                <DataTable :value="listCourse" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column field="id" header="ID" :sortable="true" style="width: 10%"></Column>
                    <Column style="width: 15%">
                        <template #header> Image </template>
                        <template #body="slotProps">
                            <img :src="slotProps.data.image.fileUrl" :alt="slotProps.data.image" width="50" class="shadow-2" />
                        </template>
                    </Column>
                    <Column field="createdAt" header="Created At" :sortable="true" style="width: 15%">
                        <template #body="slotProps">{{ formatDate(slotProps.data.createdAt) }}</template>
                    </Column>
                    <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
                    <Column field="language" header="Language" :sortable="true" style="width: 15%">
                        <template #body="slotProps"><Tag :value="slotProps.data.language" :style="{ background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' }" severity="success" class="w-6" /></template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Top Ranking</h5>
                <DataTable :value="data.courseStudent" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column field="id" header="ID" :sortable="true" style="width: 10%"></Column>
                    <Column style="width: 15%">
                        <template #header> Student </template>
                        <template #body="slotProps">{{ slotProps.data.student.user.name }} </template>
                    </Column>
                    <Column field="updatedAt" header="Updated At" :sortable="true" style="width: 15%">
                        <template #body="slotProps">{{ formatDate(slotProps.data.updatedAt) }}</template>
                    </Column>
                    <Column field="Course" header="Course" :sortable="true" style="width: 15%">
                        <template #body="slotProps">{{ slotProps.data.course.name }}</template>
                    </Column>
                    <Column field="point" header="Point" :sortable="true" style="width: 25%">
                        <template #body="slotProps">
                            <ProgressBar style="height: 12px" :value="Math.round((slotProps.data.lessonStudents.filter((ls) => ls.status == 'Correct').length / slotProps.data.course.lessons.length) * 10000) / 100" />
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h3>Currently the web supports several languages</h3>
                </div>
                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <Avatar
                                image="https://firebasestorage.googleapis.com/v0/b/webblog-bk.appspot.com/o/guides%2Fc%20(1).png?alt=media&token=1783e9dd-f79b-42e9-97ef-8102b5ee0e31"
                                size="large"
                                style="background-color: #acbece; color: #ffffff"
                                shape="circle"
                            />
                        </div>
                        <span class="text-900 line-height-3">
                            <span class="text-700 text-lg font-bold">Powerful, close to machine language. </span>
                        </span>
                    </li>
                    <li class="flex align-items-center py-2">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                            <Avatar
                                image="https://firebasestorage.googleapis.com/v0/b/webblog-bk.appspot.com/o/guides%2Fc-.png?alt=media&token=637cb38e-8f59-42d2-b377-f1b479a292e4"
                                size="large"
                                style="background-color: #acbece; color: #ffffff"
                                shape="circle"
                            />
                        </div>
                        <span class="text-700 text-lg font-bold line-height-3">Multi-paradigm, supports object-oriented programming.</span>
                    </li>
                    <li class="flex align-items-center py-2">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                            <Avatar
                                image="https://firebasestorage.googleapis.com/v0/b/webblog-bk.appspot.com/o/guides%2Fjava.png?alt=media&token=74181b6c-20e3-4eda-a41a-f559c7ff18a0"
                                size="large"
                                style="background-color: #acbece; color: #ffffff"
                                shape="circle"
                            />
                        </div>
                        <span class="text-700 text-lg font-bold line-height-3">Object-oriented, portable, reliable.</span>
                    </li>
                    <li class="flex align-items-center py-2">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                            <Avatar
                                image="https://firebasestorage.googleapis.com/v0/b/webblog-bk.appspot.com/o/guides%2Fpython.png?alt=media&token=5f7ec9d0-c51c-4ea1-ae1e-51385164786c"
                                size="large"
                                style="background-color: #acbece; color: #ffffff"
                                shape="circle"
                            />
                        </div>
                        <span class="text-700 text-lg font-bold line-height-3">Easy to learn, versatile, has a large community.</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
