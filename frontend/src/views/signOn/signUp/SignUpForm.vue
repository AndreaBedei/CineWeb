<script lang="ts" setup>
import { ref } from 'vue';
import BaseInput from '../../../components/BaseInput.vue';

const form = ref({
  name: '',
  surname: '',
  birthdate: '',
  email: '',
  password: '',
});

function handleSubmit() {
  console.log('Submitted form:', form.value);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="p-6 bg-white rounded-lg shadow-md">
    <BaseInput id="name" label="Nome" v-model="form.name" />
    <BaseInput id="surname" label="Cognome" v-model="form.surname" />
    <BaseInput id="birthdate" label="Data di nascita" type="date" v-model="form.birthdate" />
    <BaseInput id="email" label="Email" type="email" v-model="form.email" />
    <BaseInput id="password" label="Password" type="password" v-model="form.password" />
    <BaseInput id="passwordCheck" label="Conferma Password" type="password" v-model="form.password" />
    <button
      type="submit"
      class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      Registrati
    </button>
  </form>
</template>

<style scoped></style>
