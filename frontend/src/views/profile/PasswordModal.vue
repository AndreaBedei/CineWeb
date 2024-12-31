<script lang="ts" setup>
import BaseInput from '@/components/BaseInput.vue';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const props = defineProps<{
  title: string;
  id: string;
}>();

const emit = defineEmits(['closeModal', 'submitForm']);

// Stato per gli input
import { ref } from 'vue';
import SimpleButton from '@/components/SimpleButton.vue';
const oldPwd = ref('');
const newPwd = ref('');
const newPwdCk = ref('');
const msgUser = ref('');

function hashPassword(password: string, salt: string): string {
  const saltedPassword = password + salt;
  return CryptoJS.SHA512(saltedPassword).toString(CryptoJS.enc.Hex);
}

function validatePassword(password: string): boolean {
  const lengthValid = password.length > 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!lengthValid) {
    msgUser.value = 'La password deve contenere almeno 8 caratteri.';
    return false;
  }
  if (!hasNumber) {
    msgUser.value ='La password deve contenere almeno un numero.';
    return false;
  }
  if (!hasSpecialChar) {
    msgUser.value = 'La password deve contenere almeno un carattere speciale.';
    return false;
  }

  return true;
}

async function handleSubmit() {

  if (oldPwd.value !== '') {
    if (!validatePassword(newPwd.value)) {
      return;
    }
    if (newPwd.value !== newPwdCk.value) {
      msgUser.value = 'La nuova password e la conferma non coincidono.';
      return;
    }
  } else if (newPwd.value !== '' || newPwdCk.value !== '') {
    msgUser.value = 'Inserire la vecchia password per modificare la password.';
    return;
  }

  const user = await axios.get(`http://localhost:3001/users/${props.id}`);
  const salt = user.data.salt;
  const hashPassw = hashPassword(oldPwd.value, salt);
  axios.post(`http://localhost:3001/users/${props.id}`, { password: hashPassw })
    .then(() => {
      const hashPasswNew = hashPassword(newPwd.value, salt);
      emit('submitForm', ref({ password: hashPasswNew }));
      emit('closeModal');
    })
    .catch((err) => {
      msgUser.value = " " + err.response.data;
    });
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-labelledby="modal-title"
    role="dialog" aria-modal="true">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6" role="document">
      <h4 id="modal-title" class="text-lg font-semibold text-primary-dark mb-4">
        {{ props.title }}
      </h4>

      <div v-if="msgUser" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert" aria-label="true">
        <strong class="font-bold">Errore: </strong>
        <span class="block sm:inline">{{ msgUser }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20" @click="msgUser = ''">
            <title>Close</title>
            <path
              d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
          </svg>
        </span>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput id="oldpwd" label="Vecchia password*" type="password" v-model="oldPwd" require />

        <BaseInput id="newpwd" label="Nuova password*" type="password" v-model="newPwd" require />

        <BaseInput id="newpwdck" label="Conferma nuova password*" type="password" v-model="newPwdCk" require />

        <div class="flex justify-end space-x-2">
          <SimpleButton :handle-click="() => emit('closeModal')" color="secondary" size="small" rounding="small" content="Annulla" />
          <SimpleButton type="submit" color="green" size="small" rounding="small" content="Salva" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
body.modal-open {
  overflow: hidden;
}
</style>