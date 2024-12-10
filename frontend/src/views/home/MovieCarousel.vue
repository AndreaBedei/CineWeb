<script setup lang="ts">
import type { PropType } from 'vue';
import MovieCard from './MovieCard.vue';

// Props accettate dal componente
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array as PropType<Array<{ image: string; title: string; rating: number }>>,
    required: true,
  },
  
});


// Funzione per spostarsi nel carosello (opzionale)
function scroll(direction: 'left' | 'right', refElement: HTMLElement) {
  const scrollAmount = direction === 'left' ? -228 : 228;
  refElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
</script>

<template>
  <section class="mb-8">
    <header>
      <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
    </header>
    <div class="relative group">
      <div
        class="flex overflow-x-auto gap-1 no-scrollbar scroll-smooth"
        ref="carouselRef"
      >
        <MovieCard
          v-for="(movie, index) in props.movies"
          :key="index"
          :image="movie.image"
          :title="movie.title"
          :rating="movie.rating"
        />
      </div>
      <button
        class="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 hidden group-hover:block"
        aria-label="Precedente"
        @click="scroll('left', $refs.carouselRef)"
      >
        ‹
      </button>
      <button
        class="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 hidden group-hover:block"
        aria-label="Successivo"
        @click="scroll('right', $refs.carouselRef)"
      >
        ›
      </button>
    </div>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
