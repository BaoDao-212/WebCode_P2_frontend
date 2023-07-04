<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { HighCode } from 'vue-highlight-code';
import 'vue-highlight-code/dist/style.css';
const { isDarkTheme } = useLayout();

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
const H = ref(`public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}`);
onMounted(() => {
    console.log(H.value.modelValue);
});
</script>

<template>
    <div class="grid">
        <div class="col-12 xl:col-5">
            <div class="card">
                <h3 class="font-bold">Lý thuyết</h3>
                <div class="font-bold text-gray-900">
                    Đây là bài đầu tiên trong loạt bài hướng dẫn học lập trình C++ cho người mới bắt đầu, mục tiêu của bài này là giúp bạn làm quen với hệ thống và cài đặt môi trường lập trình C++. Nếu bạn đã quen với hệ thống và có môi trường lập
                    trình C++ trên máy của mình thì có thể bỏ qua bài hướng dẫn này bằng cách bấm nút CHẠY THỬ sau đó bấm NỘP BÀI bên góc phải phía dưới của màn hình.
                </div>
                <HighCode class="code my-3" :codeValue="H" :theme="dark" lang="" width="430px" :maxHeight="height"></HighCode>
            </div>
        </div>
        <div class="col-12 xl:col-7 border-round">
            <RunCode language="Java" class="border-round" />
        </div>
    </div>
</template>
<style></style>
