<script setup>
import { onMounted, ref } from 'vue';
import Storage from '../utils/Storage';
import { getInfo } from '../api/account';
import LayoutProfessor from './LayoutProfessor.vue';
import LayoutStudent from './LayoutStudent.vue';
const info = Storage.get('INFO_ACCOUNT', null);
const position = ref();
onMounted(async () => {
    if (!info) {
        const data = await getInfo();
        position.value = data.user.position;
        Storage.set('INFO_ACCOUNT', data.user);
    } else {
        position.value = info.position;
    }
});
</script>

<template>
    <div>
        <layout-professor v-if="position == 'Professor'" />
        <layout-student v-if="position == 'Student'" />
    </div>
</template>

<style lang="scss" scoped></style>
