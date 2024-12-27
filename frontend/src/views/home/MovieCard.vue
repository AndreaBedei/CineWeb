<script setup lang="ts">
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    default: "0",
  },
  movieid: {
    type: String,
    default: '',
  },
});

function fixRating(): string {
  if (props.rating === "No Recensioni"){
    return "No Recensioni";
  } else {
    return parseFloat(props.rating).toFixed(1);
  }
}
</script>

<template>
  <section class="w-56 flex-shrink-0 p-2 block hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg select-none">
    <router-link :to="{ path: `/movie`, query: { id: movieid},  }" class="block">
    <section class="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        :src="`http://localhost:3001/img/poster/${image}`"
        :alt="title"
        class="h-52 w-full object-contain bg-gray-100"
        draggable="false"
      />
      <div class="p-3">
        <h3 class="text-lg font-semibold truncate" :title="title">{{ title }}</h3>
        <p class="text-sm text-gray-500 mt-1">Voto: {{ fixRating() }}</p>
      </div>
    </section>
  </router-link>
  </section>
</template>
