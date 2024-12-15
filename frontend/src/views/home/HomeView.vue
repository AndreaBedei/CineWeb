<script setup lang="ts">
import { ref, onMounted, onUpdated, watch } from 'vue';
import Carousel from './MovieCarousel.vue';
import SimpleButton from '@/components/SimpleButton.vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import router from '@/router';
import AddMovieModal from './AddMovieModal.vue';

const user = useUserStore();
interface Movie {
  _id: string;
  title: string;
  poster: string;
  rating?: number;
}

const movieCarousels = ref<{ title: string; movies: Movie[] }[]>([]); // Array per i caroselli

const loaded = ref(false);
const modalFilm = ref(false);

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
  movieCarousels.value = [];
  try {
    // Nuove uscite
    const newReleasesResponse = await axios.get('http://localhost:3001/movies/available');
    if (newReleasesResponse.data) {
      movieCarousels.value.push({
        title: 'Nuove uscite',
        movies: newReleasesResponse.data,
      });
    }

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

function openModalAddMovie() {
  modalFilm.value = true;
}

function closeModal(update: boolean) {
  if (update){
    fetchMovies();
  }
  modalFilm.value = false;
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

watch(user, () => {
  if (user.ready) {
    fetchMovies();
    loaded.value = true;
  }
});
</script>

<template>
  <div class="p-4 w-full bg-secondary-light">
    <h1 class="text-4xl text-center font-bold text-primary-dark mt-6 mb-8">CineWeb</h1>
    <div class="flex justify-end">
      <SimpleButton v-if="user.isAdmin" content="Aggiungi film" color="primary" rounding="small" :handle-click="openModalAddMovie" />
      <AddMovieModal v-if="user.isAdmin && modalFilm" @close="closeModal" />
    </div>
    <div v-for="carousel in movieCarousels" :key="carousel.title">
      <Carousel :title="carousel.title" :movies="carousel.movies" />
    </div>
    <SimpleButton v-if="user.interests.length == 0" content="Cambia interessi" color="secondary" rounding="small" :handle-click="goToProfile"></SimpleButton>
  </div>
</template>

<style scoped></style>
