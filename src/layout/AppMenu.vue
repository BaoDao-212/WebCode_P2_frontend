<script setup>
import { ref } from 'vue';
import Storage from '../utils/Storage';
import LayoutProfessor from './LayoutProfessor.vue';
import LayoutStudent from './LayoutStudent.vue';
import LayoutAdmin from './LayoutAdmin.vue';
const info = Storage.get('INFO_ACCOUNT', null);
const position = ref();
position.value = info.position;
</script>

<template>
    <div>
        <layout-professor v-if="position == 'Professor'" />
        <layout-student v-if="position == 'Student'" />
        <layout-admin v-if="position == 'Admin'" />
    </div>
</template>

<style lang="scss" scoped></style>
