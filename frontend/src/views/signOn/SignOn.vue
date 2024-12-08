<script lang="ts" setup>
import { ref } from 'vue';
import LoginComponent from './login/LoginView.vue';
import RegisterComponent from './signUp/SignUp.vue';

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
    <div class="bg-secondary-light flex flex-col flex-grow items-center ">
        <h1 class="text-4xl font-bold text-primary-dark mt-6 mb-8">Benvenuto</h1>
        
        <div class="flex flex-col lg:flex-row items-center lg:items-start lg:justify-center lg:gap-16 w-full max-w-4xl px-4">
          <div class="flex justify-center items-center w-full lg:w-1/2">
            <img
            src="../../assets/img/icon.svg"
            alt="Logo del sito"
            class="w-48 h-48 lg:w-64 lg:h-64"
            aria-label="Logo del sito"
            />
          </div>
  
          <div v-if="!currentView" class="flex flex-col space-y-4 w-full lg:w-1/2 pt-20 ">
            <button
              @click="showLogin"
              class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary"
            >
              Accedi
            </button>
            <button
              @click="showRegister"
              class="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark focus:ring-2 focus:ring-secondary"
            >
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
            <button
              @click="resetView"
              class="py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary"
            >
              Torna indietro
            </button>
          </div>
      </div>
    </div>
  </template>

<style scoped></style>
