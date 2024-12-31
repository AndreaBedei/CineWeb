<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import MovieDetails from './MovieDetails.vue';
import Showtimes from './ShowTimesFilm.vue';
import ReviewForm from './ReviewForm.vue';
import ReviewList from './ReviewList.vue';
import { useRoute } from 'vue-router';
import IFrameComponent from './IFrameComponent.vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';

const route = useRoute();
const user = useUserStore();
const movieId = ref(route.query.id); // Sostituisci con un ID dinamico
const movie = ref(null);
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

const reviews = ref<Review[]>([]);
const showtimes = ref([]);

const fetchMovieDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/movies/movie/${movieId.value}`);
    if (response.data) {
      movie.value = response.data;
    } else {
      router.push('/NotFound');
    }
  } catch (error) {
    console.error('Errore nel caricamento del film', error);
  }
};

const fetchShowtimes = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/screenings/movie/${movieId.value}`);
    showtimes.value = response.data;
  } catch (error) {
    console.error('Errore nel caricamento degli orari', error);
  }
};

const currentOffset = ref(0);
const endReached = ref(false);
const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/reviews/screening/${movieId.value}?limit=5&offset=${currentOffset.value}`);
    console.log(response.data);
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

function updateReviews() {
  currentOffset.value = 0;
  reviews.value = [];
  endReached.value = false;
  fetchReviews();
}

onMounted(() => {
  fetchMovieDetails();
  fetchShowtimes();
  fetchReviews();
  user.socket.on('newScreeningNotification', () => {
    fetchShowtimes();
  });
});

function updateVideo() {
  fetchMovieDetails();
};

watch(() => route.query.id, (newId) => {
  movieId.value = newId as string;
  reviews.value = [];
  showtimes.value = [];
  fetchMovieDetails();
  fetchShowtimes();
  updateReviews();
});
</script>

<template>
  <div class="p-4 w-full max-w-7xl mx-auto">
    <MovieDetails v-if="movie" :movie="movie" :hasNoShowTimes="showtimes.length === 0" @updateVideo="updateVideo" />
    <Showtimes v-if="movie" :showtimes="showtimes" :movie="movie" @update="fetchShowtimes" />
    <IFrameComponent v-if="movie" :movie="movie" />
    <ReviewForm v-if="!user.isAdmin && movie" @update="updateReviews" />
    <ReviewList v-if="movie" :reviews="reviews" :endReached="endReached" @loadMore="fetchReviews" />
  </div>
</template>
