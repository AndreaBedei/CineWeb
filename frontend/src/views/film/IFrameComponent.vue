<script setup lang="ts">
import { ref, watch } from 'vue';


const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const video = ref(props.movie.trailerLink);

watch(() => props.movie.trailerLink, (newLink) => {
  video.value = newLink;
});

</script>

<template>
  <section class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
    <header>
      <h2 class="text-3xl font-bold text-primary-dark border-b pb-2 mb-4">Guarda il Trailer</h2>
    </header>

    <div v-if="video" class="relative w-full h-0 pb-[56.25%] mb-8">
      <iframe :src="`https://www.youtube.com/embed/${video}`"
        frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
        class="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl" title="Trailer del film"
        aria-label="Trailer del film">
      </iframe>
    </div>
    <p v-else class="text-lg text-gray-500">Nessun trailer disponibile</p>
  </section>
</template>