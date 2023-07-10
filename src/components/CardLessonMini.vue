<script setup>
const props = defineProps({
    lesson: {
        type: Object,
        require: true
    },
    status: {
        type: String,
        require: true
    }
});
</script>
<template>
    <Card style="width: 100px; height: 100px" class="shadow-6 m-2 border-round hover:shadow-8 border-dashed md:border-solid">
        <template #header>
            <div class="text-orange-700 text-xs font-bold bg-cyan-200 w-4">
                {{ props.status }}
            </div>
            <div class="bg-cyan-700 flex font-italic surface-overlay overflow-hidden text-overflow-ellipsis p-1 hover:text-500 text-900 text-center justify-content-center align-items-center">{{ props.lesson.name }}</div>
        </template>
    </Card>
</template>

<style lang="less">
p {
    max-height: 40px !important;
    overflow-y: hidden;
}
</style>
