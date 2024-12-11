<script lang="ts" setup>
import BaseInput from '@/components/BaseInput.vue';

const props = defineProps<{
  title: string;
  name: string;
  surname: string;
}>();

const emit = defineEmits(['closeModal', 'submitForm']);

// Stato per gli input
import { ref } from 'vue';
const newName = ref(props.name);
const newSurname = ref(props.surname);
const oldPwd = ref('');
const newPwd = ref('');
const newPwdCk = ref('');
const msgUser = ref('');
const img = ref<File | null>(null);

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    img.value = target.files[0];
  } else {
    img.value = null;
  }
}

function handleSubmit() {

  const formData = new FormData();
  formData.append('nome', newName.value);
  formData.append('cognome', newSurname.value);
  if (oldPwd.value !== '') {
    if (newPwd.value !== newPwdCk.value) {
      msgUser.value = 'La nuova password e la conferma non coincidono.';
      return;
    }
    formData.append('oldpwd', oldPwd.value);
    formData.append('newpwd', newPwd.value);
    formData.append('newpwdck', newPwdCk.value);
  }

  if (img.value) {
    formData.append('immagine', img.value);
  }

  emit('submitForm', formData);
  emit('closeModal');
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
      role="document"
    >
      <h4
        id="modal-title"
        class="text-lg font-semibold text-primary-dark mb-4"
      >
        {{ props.title }}
      </h4>

      <div v-if="msgUser" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Errore:</strong>
        <span class="block sm:inline">{{ msgUser }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" @click="msgUser = ''">
            <title>Close</title>
            <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z"/>
          </svg>
        </span>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="nome"
          label="Nome"
          v-model="newName"
          require
        />

        <BaseInput
          id="cognome"
          label="Cognome"
          v-model="newSurname"
          require
        />

        <BaseInput
          id="oldpwd"
          label="Vecchia password"
          type="password"
          v-model="oldPwd"
        />

        <BaseInput
          id="newpwd"
          label="Nuova password"
          type="password"
          v-model="newPwd"
        />

        <BaseInput
          id="newpwdck"
          label="Conferma nuova password"
          type="password"
          v-model="newPwdCk"
        />

        <div class="mb-4">
          <label for="immagine" class="block text-primary-dark font-semibold mb-2">
            Immagine profilo
          </label>
          <input
            id="immagine"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="w-full p-3 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="emit('closeModal')"
            class="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark focus:ring-2 focus:ring-secondary focus:outline-none"
            aria-label="Chiudi modale"
          >
            Chiudi
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:outline-none"
            aria-label="Salva informazioni"
          >
            Salva
          </button>
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