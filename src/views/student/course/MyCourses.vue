<script setup>
import { useCourseStore } from '@/stores/course';
import { onBeforeMount, ref } from 'vue';
const courseStore = useCourseStore();
const listCourseStudent = ref([]);
onBeforeMount(async () => {
    await courseStore.listCourseOfStudent();
    listCourseStudent.value = courseStore.getListCourseStudent;
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    chartData1.value = setChartData1();
    chartOptions1.value = setChartOptions1();
});
const chartData = ref();
const chartOptions = ref();
const chartData1 = ref();
const chartOptions1 = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const listName = listCourseStudent.value.map((cs) => cs.course.name);
    const listCorrectLesson = listCourseStudent.value.map((cs) => cs.lessonStudents.filter((ls) => ls.status == 'Correct').length);
    const listWrongLesson = listCourseStudent.value.map((cs) => cs.lessonStudents.filter((ls) => ls.status == 'Wrong').length);
    const listNewNoneLesson = listCourseStudent.value.map((cs) => cs.course.lessons.length - cs.lessonStudents.filter((ls) => ls.status == 'Correct').length - cs.lessonStudents.filter((ls) => ls.status == 'Wrong').length);

    return {
        labels: listName,
        datasets: [
            {
                type: 'bar',
                label: 'Correct',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                data: listCorrectLesson
            },
            {
                type: 'bar',
                label: 'Wrong',
                backgroundColor: documentStyle.getPropertyValue('--red-500'),
                data: listWrongLesson
            },
            {
                type: 'bar',
                label: 'New/None',
                backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                data: listNewNoneLesson
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
const setChartData1 = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const previousMonth = currentMonth - 1;
    const startDate = new Date(currentDate.getFullYear(), previousMonth, 1);
    const endDate = new Date(currentDate.getFullYear(), currentMonth, 0);
    console.log(endDate);
    console.log(startDate);
    const listName = listCourseStudent.value.map((cs) => cs.course.name);
    const data1 = listCourseStudent.value.map(
        (cs) =>
            cs.lessonStudents.filter((ls) => {
                return new Date(ls.updatedAt) > startDate && new Date(ls.updatedAt) < endDate;
            }).length
    );
    const data2 = listCourseStudent.value.map(
        (cs) =>
            cs.lessonStudents.filter((ls) => {
                return new Date(ls.updatedAt) > new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1) && new Date(ls.updatedAt) < new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            }).length
    );
    const data3 = listCourseStudent.value.map(
        (cs) =>
            cs.lessonStudents.filter((ls) => {
                return new Date(ls.updatedAt) > new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1) && new Date(ls.updatedAt) < new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
            }).length
    );
    const data4 = listCourseStudent.value.map(
        (cs) =>
            cs.lessonStudents.filter((ls) => {
                return new Date(ls.updatedAt) > new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1) && new Date(ls.updatedAt) < new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 0);
            }).length
    );
    const data5 = listCourseStudent.value.map(
        (cs) =>
            cs.lessonStudents.filter((ls) => {
                return new Date(ls.updatedAt) > new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, 1) && new Date(ls.updatedAt) < new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 0);
            }).length
    );
    console.log(data1);
    var colorArray = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gray'];

    return {
        labels: Array.from({ length: 5 }, (_, i) => {
            var currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - i);
            return currentDate.toLocaleString('en-US', { month: 'long' });
        }).reverse(),
        datasets: listName.map((course, index) => {
            return {
                label: course,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--' + colorArray[index] + '-300'),
                yAxisID: 'y',
                tension: 0.4,
                data: [data5[index], data4[index], data3[index], data2[index], data1[index]]
            };
        })
    };
};
const setChartOptions1 = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    drawOnChartArea: false,
                    color: surfaceBorder
                }
            }
        }
    };
};
</script>
<template>
    <div class="card">
        <div class="flex justify-content-between flex-swap">
            <div v-for="c in listCourseStudent" :key="c.course">
                <router-link :to="`/courseStudent/detail/${c.course.id}`">
                    <CardCourse :course="c.course" class="hover:shadow-8" />
                </router-link>
            </div>
        </div>
        <div class="card">
            <Chart type="bar" :data="chartData" :options="chartOptions" class="h-30rem" />
            <h4 class="flex justify-content-center text-primary-600 font-bold">The graph shows the number of correct sentences, the number of wrong questions and the number of new questions of all your courses</h4>
            <Chart type="line" :data="chartData1" :options="chartOptions1" class="h-30rem" />
            <h4 class="flex justify-content-center text-primary-600 font-bold">Observation chart of the learning process in the last 5 months</h4>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
