<script setup lang="ts">
import { ref } from 'vue';
import Carousel from './MovieCarousel.vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';

const user = useUserStore();
const id = user.userId;
console.log(id);

const newReleases = ref([]);
const comedyMovies = ref([]);
const horrorMovies = ref([]);

axios.get(`http://localhost:3001/movies/available`)
  .then(response => {
    const data = response.data;
    if (data) {
      newReleases.value = data;
    }
  })
  .catch(error => {
    console.error(error);
  });


// // Simile richiesta per comedyMovies e horrorMovies
// axios.get(`http://localhost:3001/movies/comedy`)
//   .then(response => {
//     const data = response.data;
//     if (data) {
//       comedyMovies.value = data;
//     }
//   })
//   .catch(error => {
//     console.error(error);
//   });

// axios.get(`http://localhost:3001/movies/horror`)
//   .then(response => {
//     const data = response.data;
//     if (data) {
//       horrorMovies.value = data;
//     }
//   })
//   .catch(error => {
//     console.error(error);
//   });
</script>

<template>
  <div class="p-4 w-full bg-secondary-light">
    <h1 class="text-4xl text-center font-bold text-primary-dark mt-6 mb-8">CineWeb</h1>
    <Carousel v-if="newReleases.length" title="Nuove uscite" :movies="newReleases" />
    <Carousel v-if="comedyMovies.length" title="Di categoria Comico" :movies="comedyMovies" />
    <Carousel v-if="horrorMovies.length" title="Di categoria Horror" :movies="horrorMovies" />
  </div>
</template>

