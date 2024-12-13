<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import Input from '@/components/BaseInput.vue';

defineProps({
  movieId: {
    type: String,
    required: true,
  },
});

const rating = ref("0");
const experience = ref('');
const message = ref('');
const hasReviewed = ref(false); // Per simulazione

const submitReview = async () => {
  try {
    const payload = {
      rating: rating.value,
      experience: experience.value,
      message: message.value,
    };
    await axios.post(`http://localhost:3001/movies/${movieId}/reviews`, payload);
    hasReviewed.value = true;
  } catch (error) {
    console.error('Errore durante l\'invio della recensione', error);
  }
};
</script>

<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold mb-4">Scrivi una recensione</h2>
    <form @submit.prevent="submitReview">
      <Input id="rating" label="Voto al film" type="number" v-model="rating" require />
      <Input id="message" label="Messaggio" type="text" v-model="message" />

      <button
        type="submit"
        class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark mt-4"
      >
        {{ hasReviewed ? 'Aggiorna' : 'Pubblica' }}
      </button>
    </form>
  </div>
</template>
