<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';
import { useUserStore } from '../stores/user';
import { useRoute } from 'vue-router';


const rating = ref("0");
const message = ref('');
const date = ref('');
const idReview = ref('');
const hasReviewed = ref(false); // Per simulazione
const user = useUserStore();
const route = useRoute();
const movieId = route.query.id;; // Sostituisci con un ID dinamico

const submitReview = async () => {
  try {
    if (hasReviewed.value) {
      const payload = {
      rating: rating.value,
      text: message.value,
      reviewDate: new Date().toISOString(),
    };
      await axios.put(`http://localhost:3001/reviews/${idReview.value}`, payload);
    } else {
      const payload = {
      rating: rating.value,
      text: message.value,
      user: user.userId,
      movie: movieId,
      };
      await axios.post(`http://localhost:3001/reviews/`, payload);
    }
    getDatas();
  } catch (error) {
    console.error('Errore durante l\'invio della recensione', error);
  }
};

onMounted(async () => {
 getDatas();
});

async function getDatas(){
  const response = await axios.get(`http://localhost:3001/reviews/user/${user.userId}/movie/${movieId}`);
  if (response.data.length === 0) {
    return;
  }
  rating.value = response.data.rating.toString();
  message.value = response.data.text;
  date.value = formatDate(response.data.reviewDate);
  idReview.value = response.data._id;
  if (date.value !== '') {
    hasReviewed.value = true;
  }
}

function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

</script>

<template>
  <div class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Scrivi una recensione</h2>
    <form @submit.prevent="submitReview">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput id="review-date" label="Data" type="text" v-model="date" :read="true" />
        <BaseInput id="rating" label="Voto al film" type="number" v-model="rating" :require="true" :range="{ min: 1, max: 5, step: 1 }" />
      </div>
      <label for="message" class="block text-primary-dark font-semibold mt-2">Recensione</label>
      <textarea id="message" v-model="message" class="w-full h-32 border border-slate-300 focus:ring-2 focus:ring-primary rounded-lg p-3 mt-2" placeholder="Scrivi qui la tua recensione"></textarea>

      <div class="flex justify-end">
        <button type="submit" class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark mt-4">
          {{ hasReviewed ? 'Aggiorna' : 'Pubblica' }}
        </button>
      </div>
    </form>
  </div>
</template> 
