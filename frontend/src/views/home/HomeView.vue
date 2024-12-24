<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Carousel from './MovieCarousel.vue';
import SimpleButton from '@/components/SimpleButton.vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
import router from '@/router';
import AddMovieModal from './AddMovieModal.vue';
import PageModal from '@/components/PageModal.vue';

const user = useUserStore();
interface Movie {
  _id: string;
  title: string;
  poster: string;
  rating?: number;
}

const movieCarousels = ref(new Map<string, Movie[]>());

const loaded = ref(false);
const modalFilm = ref(false);
const updateOk = ref(false);

function addCarousel(title: string, movies: Movie[]) {
    const newCarousels = new Map(movieCarousels.value);
    newCarousels.set(title, movies);
    movieCarousels.value = newCarousels; // Immutabile: sostituisci l'intera struttura
}

const fetchMoviesByInterest = async (interestId: string, interestName: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/movies/genre/${interestId}`);
    if (response.data) {
      if (response.data.length > 0 && !user.isAdmin) {
        addCarousel(`Di categoria ${interestName}`, response.data);
      }
    }
  } catch (error) {
    console.error(`Errore nel caricamento dei film per l'interesse ${interestName}`, error);
  }
};

const fetchMovies = async () => {
  movieCarousels.value = new Map<string, Movie[]>();
  try {

    const newMovies = await axios.get('http://localhost:3001/movies/latest');
    if (newMovies.data && user.isAdmin) {
      addCarousel('Nuovi film', newMovies.data);
    }

    const newReleasesResponse = await axios.get('http://localhost:3001/movies/available');
    if (newReleasesResponse.data) {
      addCarousel('Prossime proiezioni', newReleasesResponse.data);
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
  router.push(`/profile/${user.userId}`);
}

function openModalAddMovie() {
  modalFilm.value = true;
}

function closeModal(update: boolean) {
  if (update){
    fetchMovies();
    updateOk.value = true;
  }
  modalFilm.value = false;
}

onMounted(() => {
  if (user.ready) {
    fetchMovies();
    loaded.value = true;
  }
});


watch(() => user.ready, () => {
  if (user.ready) {
    fetchMovies();
    loaded.value = true;
  }
});
</script>

<template>
  <PageModal v-if="updateOk" :confirm="false" title="Richiesta ricevuta" message="La sua operazione è stata eseguita con successo." @closeModal="updateOk = false" />
  <div class="p-4 w-full bg-secondary-light">
    <h1 class="text-4xl text-center font-bold text-primary-dark mt-6 mb-8">CineWeb</h1>
    <div class="flex justify-end">
      <SimpleButton v-if="user.isAdmin" content="Aggiungi film" color="primary" rounding="small" :handle-click="openModalAddMovie" />
      <AddMovieModal v-if="user.isAdmin && modalFilm" @close="closeModal" />
    </div>
    <div v-for="(title) in movieCarousels" :key="title[0]">
      <Carousel :title="title[0]" :movies="title[1]" />
    </div>
    <SimpleButton v-if="movieCarousels.size !== 0 && user.interests.length === 0 && !user.isAdmin" content="Cambia interessi" color="secondary" rounding="small" :handle-click="goToProfile"></SimpleButton>
  </div>
</template>

<style scoped></style>
