<script setup lang="ts">
defineProps<{
  reviews: {
    id: number;
    user: {
      image: string;
      name: string;
    };
    rating: number;
    message: string;
  }[];
}>();
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Recensioni</h2>
    <ul class="divide-y divide-gray-300">
      <li v-for="review in reviews" :key="review.id" class="py-4 flex gap-4">
        <img
          :src="review.user.image"
          alt="Immagine utente"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 class="font-semibold">{{ review.user.name }}</h3>
          <p class="text-sm text-gray-500">Voto: {{ review.rating }}</p>
          <p>{{ review.message }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
