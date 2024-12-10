<script lang="ts" setup>
import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import axios from 'axios'; 
import BaseInput from '../../../components/BaseInput.vue';
import Modal from "../../../components/PageModal.vue";

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

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

function hashPassword(password: string, salt: string) : string {
    const saltedPassword = password + salt;
    return CryptoJS.SHA512(saltedPassword).toString(CryptoJS.enc.Hex);
}

async function handleSubmit() {
  try {
    const emailCheck = await axios.get('http://localhost:3001/users/email?email=' + form.value.email);
    if (emailCheck.data.length === 0) {
      showPasswordMismatchModal('Errore', "Mail non registrata");
      return;      
    }
    const salt = emailCheck.data[0].salt;
    const hashPassw = hashPassword(form.value.password, salt);
    await axios.post('http://localhost:3001/users/email?email=' + form.value.email, { password: hashPassw});
    // TODO Avviare la sessione
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
      showPasswordMismatchModal('Errore di autenticazione', "Errore: " + error.response.data);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="p-6 bg-white rounded-lg shadow-md">
    <BaseInput id="email" label="Email" type="email" v-model="form.email" />
    <BaseInput id="password" label="Password" type="password" v-model="form.password" />
    <button
      type="submit"
      class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      Entra
    </button>
  </form>
  <Modal
      v-if="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @closeModal="closeModal"
    />
</template>

<style scoped></style>
