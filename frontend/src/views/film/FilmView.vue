<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MovieDetails from './MovieDetails.vue';
import Showtimes from './ShowTimesFilm.vue';
import ReviewForm from './ReviewForm.vue';
import ReviewList from './ReviewList.vue';
import { useRoute } from 'vue-router';
import IFrameComponent from './IFrameComponent.vue';

const route = useRoute();
const movieId = route.query.id;; // Sostituisci con un ID dinamico
const movie = ref(null);
const reviews = ref([]);
const showtimes = ref([]);

const fetchMovieDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/movies/movie/${movieId}`);
    movie.value = response.data;
  } catch (error) {
    console.error('Errore nel caricamento del film', error);
  }
};

const fetchShowtimes = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/screenings/movie/${movieId}`);
    showtimes.value = response.data;
  } catch (error) {
    console.error('Errore nel caricamento degli orari', error);
  }
};

const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/reviews/screening/${movieId}`);
    reviews.value = response.data;
  } catch (error) {
    console.error('Errore nel caricamento delle recensioni', error);
  }
};

function updateReviews() {
  fetchReviews();
}

onMounted(() => {
  fetchMovieDetails();
  fetchShowtimes();
  fetchReviews();
});
</script>

<template>
  <div class="p-4 w-full">
    <MovieDetails v-if="movie" :movie="movie" />
    <Showtimes v-if="showtimes" :showtimes="showtimes" />
    <IFrameComponent v-if="movie" :movie="movie" />
    <ReviewForm @update="updateReviews"/>
    <ReviewList v-if="reviews" :reviews="reviews" />
  </div>
</template>
