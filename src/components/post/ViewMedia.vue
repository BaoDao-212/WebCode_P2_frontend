<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps({
    media: {
        type: Object,
        require: true
    }
});
const media = ref(props.media);
</script>
<template>
    <div>
        <Galleria v-model:value="media" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
            <template #item="slotProps">
                <img :src="slotProps.item.fileUrl" :alt="slotProps.item.fileUrl" style="width: 100%" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="slotProps.item.fileUrl" :alt="slotProps.item.fileUrl" width="40" />
            </template>
        </Galleria>
    </div>
</template>

<style lang="scss" scoped></style>
