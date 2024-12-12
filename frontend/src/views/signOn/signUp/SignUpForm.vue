<script lang="ts" setup>
import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import axios from 'axios'; 
import Modal from "../../../components/PageModal.vue";
import BaseInput from '../../../components/BaseInput.vue';

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

function hashPassword(password: string, salt: string) : string {
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

// Funzione di submit
async function handleSubmit() {
  if (form.value.password != form.value.passwordCheck) {
    showPasswordMismatchModal('Password non coincidenti', "Le password inserite non coincidono. Verifica e riprova.")
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
    await axios.put('http://localhost:3001/users/'+result.data._id, { password: hashPassw});
    showPasswordMismatchModal('Congratulazioni', "La registrazione è avvenuta con successo!");
    form.value = {
      name: '',
      surname: '',
      birthdate: '',
      email: '',
      password: '',
      passwordCheck: '',
    };
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
    <button
      type="submit"
      class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      Registrati
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
