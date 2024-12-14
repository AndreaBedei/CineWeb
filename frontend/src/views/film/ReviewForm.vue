<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';
import { useUserStore } from '../stores/user';
import { useRoute } from 'vue-router';


const rating = ref("0");
const message = ref('');
const date = ref('');
const hasReviewed = ref(false); // Per simulazione
const user = useUserStore();
const route = useRoute();
const movieId = route.query.id;; // Sostituisci con un ID dinamico

const submitReview = async () => {
  try {
    const payload = {
      rating: rating.value,
      message: message.value,
    };
    await axios.post(`http://localhost:3001/movies/reviews`, payload);
    hasReviewed.value = true;
  } catch (error) {
    console.error('Errore durante l\'invio della recensione', error);
  }
};

onMounted(async () => {
  const response = await axios.get(`http://localhost:3001/reviews/user/${user.userId}/movie/${movieId}`);
  rating.value = response.data.rating;
  message.value = response.data.text;
  date.value = formatDate(response.data.reviewDate);
  if (date.value !== '') {
    hasReviewed.value = true;
  }
});

function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

// const getRewiew = async () => {
//   try {
//     const payload = {
//       rating: rating.value,
//       experience: experience.value,
//       message: message.value,
//     };
//     await axios.post(`http://localhost:3001/movies/reviews`, payload);
//     hasReviewed.value = true;
//   } catch (error) {
//     console.error('Errore durante l\'invio della recensione', error);
//   }
// };
</script>

<template>
  <div class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Scrivi una recensione</h2>
    <form @submit.prevent="submitReview">
      <BaseInput id="review-date" label="Data" type="text" v-model="date" :read="true" />
      <BaseInput id="rating" label="Voto al film" type="number" v-model="rating" :require="true" />
      <BaseInput id="message" label="Messaggio" type="text" v-model="message" />


      <button type="submit" class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark mt-4">
        {{ hasReviewed ? 'Aggiorna' : 'Pubblica' }}
      </button>
    </form>
  </div>
</template>
