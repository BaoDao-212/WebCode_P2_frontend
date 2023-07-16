<script setup>
import { listUser, createStudent, listStudent, detailStudent } from '@/api/account';
import { listCourseStudentOfProfessor } from '@/api/course';
import { useToast } from 'primevue/usetoast';
import { reactive, ref, onBeforeMount } from 'vue';

const form = reactive({
    userId: '',
    class: ''
});
const listNewUser = ref([]);
const Arrstudents = ref([]);
const detailsStudent = ref([]);
const student = ref([]);
onBeforeMount(async () => {
    const { users } = await listUser();
    const { students } = await listStudent();

    Arrstudents.value = students;
    console.log(students);
    listNewUser.value = users.filter((user) => !students.map((stu) => stu.user.id).includes(user.id));
});
const selectedUser = ref();
const toast = useToast();
const createStudentFunc = async () => {
    form.userId = selectedUser.value.id;
    if (form.userId == '' || form.class.trim() == '') {
        return toast.add({ severity: 'error', summary: 'Error', detail: 'Please do not leave the above 2 fields blank', life: 3000 });
    }
    const res = await createStudent(form);
    if (res.ok) return toast.add({ severity: 'info', summary: 'Info Message', detail: 'User has been empowered for Students', life: 3000 });
    else return toast.add({ severity: 'error', summary: 'Error', detail: `${res.error.message}`, life: 3000 });
};
const visible = ref(false);

const showStudentDetail = ref(false);
const detailStudentFunc = async (studentId) => {
    showStudentDetail.value = true;
    const data = await detailStudent(studentId);
    student.value = data.student;
    const { courseData } = await listCourseStudentOfProfessor(studentId);
    detailsStudent.value = courseData;
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
};
const chartData = ref();
const chartOptions = ref();
const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    return {
        labels: detailsStudent.value.map((course) => course.name),
        datasets: [
            {
                type: 'bar',
                label: 'Correct',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                data: detailsStudent.value.map((course) => course.numberCorrectAnswer)
            },
            {
                type: 'bar',
                label: 'Wrong',
                backgroundColor: documentStyle.getPropertyValue('--red-500'),
                data: detailsStudent.value.map((course) => course.numberWrongAnswer)
            },
            {
                type: 'bar',
                label: 'New/None',
                backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                data: detailsStudent.value.map((course) => course.numberNewAnswer)
            }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
};
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
    <Toast />
    <div class="flex justify-content-end">
        <Button label="Create Student" icon="pi pi-user-plus" outlined raised @click="visible = true" />
    </div>
    <Dialog v-model:visible="visible" maximizable modal header="Create Student" :style="{ width: '50vw' }">
        <div class="flex flex-column">
            <h4 class="text-blue-600 flex">Account User</h4>
            <Dropdown v-model="selectedUser" :options="listNewUser" optionLabel="name" placeholder="Select a user" class="w-full md:w-40rem mb-5">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center flex-column">
                        <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex flex-column font-semibold">
                        <div>Name: {{ slotProps.option.name }}</div>
                        <div>Email: {{ slotProps.option.email }}</div>
                    </div>
                </template>
            </Dropdown>
            <h4 class="text-blue-600 flex">Class</h4>
            <InputText id="class" type="text" placeholder="Please enter class" class="w-full md:w-40rem mb-5" v-model="form.class" />
        </div>
        <div class="flex justify-content-end">
            <Button icon="pi pi-spin pi-plus" outlined severity="success" raised label="Create" @click="createStudentFunc()"></Button>
        </div>
    </Dialog>
    <Dialog v-model:visible="showStudentDetail" maximizable modal header="Detail Student" :style="{ width: '80vw' }">
        <div class="card text-6xl text-blue-800 font-bold flex justify-content-center" v-if="!detailsStudent">No Data</div>
        <div v-else class="flex flex-column">
            <div class="card" v-if="student">
                <h3>Overview</h3>
                <div class="font-bold text-xl">
                    Name: <span class="text-green-800 font-semibold">{{ student.user.name }}</span>
                </div>
                <div class="font-bold text-xl">
                    Created at: <span class="text-green-800 font-semibold">{{ formatDate(student.createdAt) }}</span>
                </div>
                <div class="font-bold text-xl">
                    Class: <span class="text-green-800 font-semibold">{{ student.class }}</span>
                </div>
                <div class="font-bold text-xl">
                    Email: <span class="text-green-800 font-semibold">{{ student.user.email }}</span>
                </div>
                <div class="font-bold text-xl">
                    Number registered course: <span class="text-green-800 font-semibold">{{ detailsStudent.length }}</span>
                </div>
            </div>
            <Chart type="bar" :data="chartData" :options="chartOptions" class="h-30rem" />
        </div>
    </Dialog>
    <div class="card mt-4">
        <DataTable :value="Arrstudents" dataKey="id" responsiveLayout="scroll" :rows="8" :paginator="true">
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
                    {{ slotProps.data.user.name }}
                </template>
            </Column>
            <Column field="name" header="Email" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.user.email }}
                </template>
            </Column>
            <Column field="name" header="Class" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.class }}
                </template>
            </Column>

            <Column field="action" header="Action" :showFilterMatchModes="false" style="min-width: 13rem" class="">
                <template #body="{ data }">
                    <div>
                        <Button class="mr-1" label="Detail" outlined @click="detailStudentFunc(data.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style lang="scss" scoped></style>
