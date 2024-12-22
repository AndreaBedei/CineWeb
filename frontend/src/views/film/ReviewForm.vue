<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';
import { useUserStore } from '../../stores/user';
import { useRoute } from 'vue-router';
import Modal from "@/components/PageModal.vue";
import SimpleButton from '@/components/SimpleButton.vue';

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

function showOk(title: string, message: string) {
  modalTitle.value = title;
  modalMessage.value = message;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const rating = ref("0");
const message = ref('');
const date = ref('');
const idReview = ref('');
const hasReviewed = ref(false); // Per simulazione
const user = useUserStore();
const route = useRoute();
const movieId = ref(route.query.id); // Sostituisci con un ID dinamico

const emit = defineEmits(['update']);

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
        movie: movieId.value,
      };
      await axios.post(`http://localhost:3001/reviews/`, payload);
    }
    emit('update');
    showOk('Recensione inviata', 'La tua recensione è stata inviata con successo');
    getDatas();
    user.socket.emit('newReview', { movieId: movieId.value });
  } catch (error) {
    console.error('Errore durante l\'invio della recensione', error);
  }
};

onMounted(async () => {
  getDatas();
});

async function getDatas() {
  const response = await axios.get(`http://localhost:3001/reviews/user/${user.userId}/movie/${movieId.value}`);
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

function deleteReview() {
  axios.delete(`http://localhost:3001/reviews/${idReview.value}`);
  rating.value = "0";
  message.value = '';
  date.value = '';
  hasReviewed.value = false;
  emit('update');
}

watch(() => route.query.id, (newId) => {
  movieId.value = newId as string;
  getDatas();
});
</script>

<template>
  <div class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold text-primary-dark border-b pb-2 mb-4">Scrivi una recensione</h2>
    <form @submit.prevent="submitReview">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput id="review-date" label="Data" type="text" v-model="date" :read="true" />
        <BaseInput id="rating" label="Voto al film" type="number" v-model="rating" :require="true"
          :range="{ min: 1, max: 5, step: 1 }" />
      </div>
      <label for="message" class="block text-primary-dark font-semibold mt-2">Recensione</label>
      <textarea id="message" v-model="message"
        class="w-full h-32 border border-slate-300 focus:ring-2 focus:ring-primary rounded-lg p-3 mt-2"
        placeholder="Scrivi qui la tua recensione"></textarea>

      <div class="flex justify-end">
        <SimpleButton v-if="hasReviewed" :handleClick="deleteReview" type="button" content="Elimina" color="red"
          class="text-white py-2 px-4 rounded-lg hover:bg-red-800 mt-4 mx-2" rounding="small" />
        <SimpleButton type="submit" :content="hasReviewed ? 'Aggiorna' : 'Pubblica'" color="primary" rounding="small" />
      </div>
    </form>
  </div>
  <Modal v-if="showModal" :confirm="false" :title="modalTitle" :message="modalMessage" @closeModal="closeModal" />
</template>
