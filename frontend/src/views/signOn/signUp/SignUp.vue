<script lang="ts" setup>
import SignUpForm from './SignUpForm.vue'; 

const emit = defineEmits(['closeRegister']);

function closeRegister() {
  emit('closeRegister');
}
</script>

<template>
  <div class="pb-4 bg-secondary-light flex items-center justify-center">
    <section class="max-w-md w-full">
      <h2 class="text-3xl font-bold text-center text-primary-dark mb-3">Registrati</h2>
      <SignUpForm @closeRegister="closeRegister" />
    </section>
  </div>
</template>

<style scoped></style>

