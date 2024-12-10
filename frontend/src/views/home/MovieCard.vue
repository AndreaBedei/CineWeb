<script setup lang="ts">
defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  link: {
    type: String,
    default: '#', // Link di default, ad esempio pagina di dettaglio
  },
});
</script>

<template>
  <a
    :href="link"
    class="w-56 flex-shrink-0 p-2 block hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
  >
    <section class="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        :src="image"
        :alt="title"
        class="h-52 w-full object-contain bg-gray-100"
      />
      <div class="p-3">
        <h3 class="text-lg font-semibold truncate" :title="title">{{ title }}</h3>
        <p class="text-sm text-gray-500 mt-1">Voto: {{ rating.toFixed(1) }}</p>
      </div>
    </section>
  </a>
</template>
