<script setup>
import { deleteComment } from '@/api/post';
import { useToast } from 'primevue/usetoast';
import Storage from '@/utils/Storage';
import { defineProps, ref, defineEmits, onMounted } from 'vue';
const props = defineProps({
    ownerid: {
        type: Number,
        require: true
    },
    comment: {
        type: Object,
        require: true
    }
});
const toast = useToast();
const emit = defineEmits(['update-message']);
const deleteCommentO = async () => {
    const res = await deleteComment(props.comment.id);
    console.log(res);
    if (res.ok === false) {
        toast.add({ severity: 'error', summary: `${res.error.mainReason}`, detail: `${res.error.message}`, life: 3000 });
        return;
    } else if (res.ok === true) {
        emit('update-message');
    }
};
const checkDeleteComment = ref();
onMounted(async () => {
    const info = Storage.get('INFO_ACCOUNT', null);
    console.log(info.user);
    checkDeleteComment.value = info.id == props.comment.owner.id || info.user.id == props.ownerid;
});
const comment = ref(props.comment);
</script>

<template>
    <div class="flex flex-row align-items-center">
        <Toast />
        <Avatar v-if="comment.owner.avatar" :src="comment.owner.avatar.fileUrl" class="mr-2" shape="circle" />
        <Avatar icon="pi pi-user" v-else class="mr-2" shape="circle" />

        <div class="border-4 border-round-2xl border-double border-cyan-500 mt-2 surface-200 shadow-4 w-8 font-medium flex flex-row justify-content-between">
            <div>
                <div class="flex flex-row ml-1 pt-1">
                    <div class="font-bold text-xl font-semibold text-blue-900">{{ comment.owner.name }}</div>
                </div>
                <div v-for="userTag in comment.userTags" :key="userTag.id" class="flex flex-row">
                    <div class="font-bold font-light text-blue-900">@{{ userTag.name }}</div>
                </div>
                <p class="pl-2 text-cyan-900">
                    {{ comment.contentComment }}
                </p>
                <div v-if="comment.file.length > 0" class="flex flex-row">
                    <div v-for="ava in comment.file" :key="ava.fileUrl">
                        <Image :src="ava.fileUrl" alt="Image" preview width="200" />
                    </div>
                </div>
            </div>
            <Button v-if="checkDeleteComment" icon="pi pi-times" text class="m-0" aria-label="Delete Comment" @click="deleteCommentO" />
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
