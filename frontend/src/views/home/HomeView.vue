<script setup lang="ts">
import Carousel from './MovieCarousel.vue';

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

