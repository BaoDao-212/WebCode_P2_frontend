<script setup>
import { listUserProfessor, createProfessor, listProfessor } from '@/api/account';
import { useToast } from 'primevue/usetoast';
import { reactive, ref, onBeforeMount } from 'vue';

const form = reactive({
    userId: '',
    academicLevel: ''
});
const listNewUser = ref([]);
const ArrProfessors = ref([]);
onBeforeMount(async () => {
    const { users } = await listUserProfessor();
    const { professors } = await listProfessor();
    ArrProfessors.value = professors;
    console.log(professors);
    listNewUser.value = users.filter((user) => !professors.map((pro) => pro.professor.user.id).includes(user.id));
});
const selectedUser = ref();
const toast = useToast();
const createProfessorFunc = async () => {
    form.userId = selectedUser.value.id;
    if (form.userId == '' || form.academicLevel.trim() == '') {
        return toast.add({ severity: 'error', summary: 'Error', detail: 'Please do not leave the above 2 fields blank', life: 3000 });
    }
    const res = await createProfessor(form);
    if (res.ok) return toast.add({ severity: 'info', summary: 'Info Message', detail: 'User has been empowered for Professor', life: 3000 });
    else return toast.add({ severity: 'error', summary: 'Error', detail: `${res.error.message}`, life: 3000 });
};
const visible = ref(false);
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
        <Button label="Create Professor" icon="pi pi-user-plus" outlined raised @click="visible = true" />
    </div>
    <Dialog v-model:visible="visible" maximizable modal header="Create Professor" :style="{ width: '50vw' }">
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
            <h4 class="text-blue-600 flex">Academic Level</h4>
            <InputText id="class" type="text" placeholder="Please enter academic level of professor" class="w-full md:w-40rem mb-5" v-model="form.academicLevel" />
        </div>
        <div class="flex justify-content-end">
            <Button icon="pi pi-spin pi-plus" outlined severity="success" raised label="Create" @click="createProfessorFunc()"></Button>
        </div>
    </Dialog>
    <div class="card mt-4">
        <DataTable :value="ArrProfessors" dataKey="id" responsiveLayout="scroll" :rows="8" :paginator="true">
            <Column field="id" header="ID" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.professor.id }}
                </template>
            </Column>
            <Column field="name" header="Created at" :sortable="true">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.professor.createdAt) }}
                </template>
            </Column>
            <Column field="name" header="Name" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.professor.user.name }}
                </template>
            </Column>
            <Column field="name" header="Email" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.professor.user.email }}
                </template>
            </Column>
            <Column field="name" header="Academic" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.professor.academicLevel }}
                </template>
            </Column>
            <Column field="name" header="Number Course" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.numbers }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style lang="scss" scoped></style>
