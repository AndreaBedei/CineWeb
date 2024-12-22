<script lang="ts" setup>
import { ref } from 'vue';
import BaseInput from '../../../components/BaseInput.vue';
import Modal from "../../../components/PageModal.vue";
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
  router.push('/');
}

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

const user = useUserStore();

function showPasswordMismatchModal(title: string, message: string) {
    modalTitle.value = title;
    modalMessage.value = message;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

const form = ref({
    name: '',
    surname: '',
    birthdate: '',
    email: '',
    password: '',
});

async function handleSubmit() {

    const res = await user.login(form.value.email, form.value.password);
    if (!res.success) {
        switch (res.errorNum) {
            case 0:
                showPasswordMismatchModal('Errore', "Mail non registrata");
            default:
                showPasswordMismatchModal('Errore di autenticazione', "Errore: " + res.error?.response?.data);
        }
    }else{
        goToHome();
    }

}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="p-6 bg-white rounded-lg shadow-md">
        <BaseInput id="email" label="Email" type="email" v-model="form.email" />
        <BaseInput id="password" label="Password" type="password" v-model="form.password" />
        <button type="submit"
            class="w-full bg-primary text-white py-3 mt-3 rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Entra
        </button>
    </form>
    <Modal v-if="showModal" :title="modalTitle" :confirm="false" :message="modalMessage" @closeModal="closeModal" />
</template>

<style scoped></style>
