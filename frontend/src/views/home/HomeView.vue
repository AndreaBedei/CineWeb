<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import Carousel from './MovieCarousel.vue';
import SimpleButton from '@/components/SimpleButton.vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import router from '@/router';

const user = useUserStore();
// const userInterests = ref(user.interests); // Interesse dell'utente
const movieCarousels = ref<{ title: string; movies: unknown[] }[]>([]); // Array per i caroselli

const loaded = ref(false);

const fetchMoviesByInterest = async (interestId: string, interestName: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/movies/genre/${interestId}`);
    if (response.data) {
      if (response.data.length > 0) {
        movieCarousels.value.push({
          title: `Di categoria ${interestName}`,
          movies: response.data,
        });
      }
    }
  } catch (error) {
    console.error(`Errore nel caricamento dei film per l'interesse ${interestName}`, error);
  }
};

const fetchMovies = async () => {
  try {
    // Nuove uscite
    const newReleasesResponse = await axios.get('http://localhost:3001/movies/available');
    if (newReleasesResponse.data) {
      movieCarousels.value.push({
        title: 'Nuove uscite',
        movies: newReleasesResponse.data,
      });
    }

    console.log(user.userId);
    console.log(user.name);
    console.log(user.interests);

    // Carica film per ciascun interesse
    for (const interest of user.interests) {
      await fetchMoviesByInterest(interest._id, interest.name);
    }
  } catch (error) {
    console.error('Errore nel caricamento dei film', error);
  }
};

function goToProfile() {
  router.push('/profile');
}

onMounted(() => {
  if (user.ready) {
    fetchMovies();
    loaded.value = true;
  }
});


onUpdated(() => {
  if (!loaded.value && user.ready) {
    fetchMovies();
    loaded.value = true;
  }
});
</script>

<template>
  <div class="p-4 w-full bg-secondary-light">
    <h1 class="text-4xl text-center font-bold text-primary-dark mt-6 mb-8">CineWeb</h1>
    <div v-for="carousel in movieCarousels" :key="carousel.title">
      <Carousel :title="carousel.title" :movies="carousel.movies" />
    </div>
    <SimpleButton v-if="user.interests.length == 0" content="Cambia interessi" color="secondary" rounding="small"
      :handle-click="goToProfile"></SimpleButton>
  </div>
</template>

<style scoped></style>
