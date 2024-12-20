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

const emit = defineEmits(['closeRegister']);

function closeModal() {
  showModal.value = false;
}

function hashPassword(password: string, salt: string): string {
  const saltedPassword = password + salt; // Concatenazione di password e salt
  return CryptoJS.SHA512(saltedPassword).toString(CryptoJS.enc.Hex); // Calcola hash
}

const form = ref({
  name: '',
  surname: '',
  birthdate: '',
  email: '',
  password: '',
  passwordCheck: '',
});

function validatePassword(password: string): boolean {
  const lengthValid = password.length > 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!lengthValid) {
    showPasswordMismatchModal('Password troppo corta', 'La password deve contenere almeno 8 caratteri.');
    return false;
  }
  if (!hasNumber) {
    showPasswordMismatchModal('Password senza numeri', 'La password deve contenere almeno un numero.');
    return false;
  }
  if (!hasSpecialChar) {
    showPasswordMismatchModal('Password senza caratteri speciali', 'La password deve contenere almeno un carattere speciale.');
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (!validatePassword(form.value.password)) {
    return;
  }

  if (form.value.password !== form.value.passwordCheck) {
    showPasswordMismatchModal('Password non coincidenti', "Le password inserite non coincidono. Verifica e riprova.");
    return;
  }

  const password = form.value.password;
  form.value.password = '';
  form.value.passwordCheck = '';

  try {
    const emailCheck = await axios.get('http://localhost:3001/users/email?email=' + form.value.email);
    if (emailCheck.data.length > 0) {
      showPasswordMismatchModal('Email già registrata', "L'email inserita è già registrata. Inserisci un'altra email.");
      return;
    }

    const result = await axios.post('http://localhost:3001/users', form.value);
    const hashPassw = hashPassword(password, result.data.salt);

    try {
      await axios.put('http://localhost:3001/users/' + result.data._id, { password: hashPassw });
      emit('closeRegister');
    } catch (error) {
      showPasswordMismatchModal('Errore inserimento', "Errore nell'inserimento dell'utente. Riprova.\n" + error);
    }
  } catch (error) {
    showPasswordMismatchModal('Errore inserimento', "Errore nell'inserimento dell'utente. Riprova.\n" + error);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="p-6 bg-white rounded-lg shadow-md">
    <BaseInput id="name" label="Nome" v-model="form.name" require />
    <BaseInput id="surname" label="Cognome" v-model="form.surname" require />
    <BaseInput id="birthdate" label="Data di nascita" type="date" v-model="form.birthdate" require />
    <BaseInput id="email" label="Email" type="email" v-model="form.email" require />
    <BaseInput id="password" label="Password" type="password" v-model="form.password" require />
    <BaseInput id="passwordCheck" label="Conferma Password" type="password" v-model="form.passwordCheck" require />
    <small class="text-gray-600">Requisiti Password: La password deve contenere:<br>- Almeno 8 caratteri<br>- Almeno un numero<br>- Almeno un carattere speciale.</small>
    <button type="submit"
      class="w-full bg-primary text-white py-3 rounded-lg mt-3 hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2">
      Registrati
    </button>
  </form>

  <Modal v-if="showModal" :title="modalTitle" :confirm="false" :message="modalMessage" @closeModal="closeModal" />
</template>

<style scoped></style>
