<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Carousel from './MovieCarousel.vue';
import SimpleButton from '@/components/SimpleButton.vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user';
import router from '@/router';
import AddMovieModal from './AddMovieModal.vue';
import PageModal from '@/components/PageModal.vue';
import ReviewList from '../film/ReviewList.vue';

const user = useUserStore();
interface Movie {
  _id: string;
  title: string;
  poster: string;
  rating?: number;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePicture: string;
    surname: string;
  };
  rating: number;
  text: string;
  reviewDate: string;
  movieTitle: string;
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
  if (update) {
    fetchMovies();
    updateOk.value = true;
  }
  modalFilm.value = false;
}

onMounted(() => {
  if (user.ready) {
    fetchMovies();
    loaded.value = true;
    if (user.isAdmin) {
      fetchReviews();
    }
  }
  user.socket.on('deleteReviewNotification', () => {
    currentOffset.value = 0;
    reviews.value = [];
    fetchReviews();
  });
});

const reviews = ref<Review[]>([]);
const currentOffset = ref(0);
const endReached = ref(false);

const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/reviews?limit=5&offset=${currentOffset.value}`);
    if (response.data.length === 0) {
      endReached.value = true;
    } else if (response.data) {
      const newReviews = response.data;
      reviews.value.push(...newReviews);
      currentOffset.value += 5;
    }
  } catch (error) {
    console.error('Errore nel caricamento delle recensioni', error);
  }
};

watch(() => user.ready, () => {
  if (user.ready) {
    fetchMovies();
    if (user.isAdmin) {
      fetchReviews();
    }
    loaded.value = true;
  }
});
</script>

<template>
  <PageModal v-if="updateOk" :confirm="false" title="Richiesta ricevuta"
    message="La sua operazione è stata eseguita con successo." @closeModal="updateOk = false" />
  <section class="p-4 w-full bg-secondary-light">
    <header>
      <h1 class="text-4xl text-center font-bold text-primary-dark mt-6 mb-8">CineWeb</h1>
    </header>
    <section class="pb-5">
      <div v-if="user.isAdmin" class="flex justify-end">
        <SimpleButton content="Aggiungi film" color="primary" rounding="small" :handle-click="openModalAddMovie"
          class="mx-2" />
        <SimpleButton content="Modifica sale" color="secondary" rounding="small"
          :handle-click="() => router.push('/edithalls')" />
        <AddMovieModal v-if="modalFilm" @close="closeModal" />
      </div>
      <div v-for="(title) in movieCarousels" :key="title[0]">
        <Carousel v-if="title[1].length > 0" :title="title[0]" :movies="title[1]" />
      </div>
      <div class="flex justify-center">
        <SimpleButton v-if="movieCarousels.size !== 0 && user.interests.length === 0 && !user.isAdmin"
          content="Aggiungi interessi" color="secondary" rounding="small" :handle-click="goToProfile"></SimpleButton>
      </div>
    </section>
    <section>
      <ReviewList v-if="reviews && user.isAdmin" :reviews="reviews" :end-reached="endReached"
        title="Ultime recensioni aggiunte" @load-more="fetchReviews" />
    </section>
  </section>
</template>
