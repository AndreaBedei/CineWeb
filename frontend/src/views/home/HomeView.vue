<script setup lang="ts">
import Carousel from './MovieCarousel.vue';
import axios from 'axios';

const id = "6759566a35d32d551c8bb5e5";


async function getInterests() {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${id}&language=it-IT`);
    console.log(response.data.genres);
  } catch (error) {
    console.error(error);
  }
}


async function getMovies() {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${id}&language=it-IT&page=1`);
    console.log(response.data.results);
  } catch (error) {
    console.error(error);
  }
}



const newReleases = [
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 1', rating: 4.5 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 2', rating: 3.8 },
];

const comedyMovies = [
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 3', rating: 4.2 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 4', rating: 3.7 },
  // Aggiungi altri film...
];

const horrorMovies = [
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 5', rating: 4.8 },
  { image: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg', title: 'Film 6', rating: 3.9 },
  // Aggiungi altri film...
];



</script>

<template>
  <div class="p-4 w-full bg-secondary-light">
    <h1 class="text-4xl text-center font-bold text-primary-dark mt-6 mb-8">CineWeb</h1>
    <Carousel title="Nuove uscite" :movies="newReleases" />
    <Carousel title="Di categoria Comico" :movies="comedyMovies" />
    <Carousel title="Di categoria Horror" :movies="horrorMovies" />
  </div>
</template>

