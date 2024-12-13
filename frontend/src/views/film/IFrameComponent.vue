<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

</script>

<template>
    <section class="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
        <header>
            <h2 class="text-2xl font-semibold text-primary-dark mb-4">Guarda il Trailer</h2>
        </header>

        <div class="relative w-full h-0 pb-[56.25%] mb-8">
            <iframe :src="`https://www.youtube.com/embed/pO1iLXRGaZY`" frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
                class="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl" title="Trailer del film"
                aria-label="Trailer del film"></iframe>
        </div>
    </section>
</template>