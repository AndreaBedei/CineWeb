<script lang="ts" setup>
import { ref } from 'vue';
import LoginComponent from './login/LoginView.vue';
import RegisterComponent from './signUp/SignUp.vue';
import SimpleButton from '@/components/SimpleButton.vue';

const currentView = ref<'login' | 'register' | null>(null);

function showLogin() {
  currentView.value = 'login';
}

function showRegister() {
  currentView.value = 'register';
}

function resetView() {
  currentView.value = null;
}
</script>

<template>
  <div class="bg-secondary-light flex flex-col flex-grow items-center">
    <div class="flex w-full mx-10">
      <h1
        class="flex-grow text-4xl font-bold text-primary-dark mt-6 mx-6 pb-2 w-full text-center border-b-solid border-b-1 border-b-black">
        Benvenuto</h1>
    </div>

    <div class="flex my-auto gap-20 lg:gap-10 flex-col lg:flex-row items-center w-full max-w-4xl px-4 py-10">
      <div class="flex justify-center items-center w-full lg:w-1/2">
        <img src="../../assets/img/icon.svg" alt="Logo del sito" class="w-48 h-48 lg:w-64 lg:h-64"
          aria-label="Logo del sito" />
      </div>

      <div v-if="!currentView" class="flex flex-col space-y-4 w-2/3 lg:w-1/2">
        <button @click="showLogin"
          class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary">
          Accedi
        </button>
        <button @click="showRegister"
          class="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark focus:ring-2 focus:ring-secondary">
          Registrati
        </button>
      </div>

      <div v-if="currentView" class="flex flex-col w-full mb-5">
        <div v-if="currentView === 'login'">
          <LoginComponent />
        </div>
        <div v-else-if="currentView === 'register'">
          <RegisterComponent />
        </div>
        <SimpleButton v-if="currentView" @click="resetView" content="Torna indietro" color="secondary" size="small"
          rounding="small" class="py-2 bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary">
        </SimpleButton>

      </div>
    </div>
  </div>
</template>

<style scoped></style>
